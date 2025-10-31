import { Client, TopicCreateTransaction, TopicMessageSubmitTransaction, TokenCreateTransaction, TokenMintTransaction, TransferTransaction, TokenType } from '@hashgraph/sdk';
import crypto from 'crypto';
import { env } from '../config/env.js';

export function hederaClient(): Client | null {
  const network = env.HEDERA_NETWORK || 'testnet';
  if (!env.HEDERA_ACCOUNT_ID || !env.HEDERA_PRIVATE_KEY) return null;
  const client = Client.forName(network);
  client.setOperator(env.HEDERA_ACCOUNT_ID, env.HEDERA_PRIVATE_KEY);
  return client;
}

export async function ensureTopic(client: Client): Promise<string> {
  if (env.HCS_TOPIC_ID) return env.HCS_TOPIC_ID;
  const tx = await new TopicCreateTransaction().execute(client);
  const receipt = await tx.getReceipt(client);
  if (!receipt.topicId) {
    throw new Error('Topic creation failed: topicId is null');
  }
  return receipt.topicId.toString();
}

export async function writeHcsMessage(
  client: Client | null,
  topicId: string | undefined,
  payload: unknown
): Promise<{ txId: string; mirrorUrl: string }> {
  const message = JSON.stringify(payload);
  if (!client || !topicId) {
    // Mocked path
    const txId = `mock-${Date.now()}`;
    const mirrorBase = env.HEDERA_MIRROR_BASE_URL || (env.HEDERA_NETWORK === 'mainnet'
      ? 'https://mainnet-public.mirrornode.hedera.com'
      : 'https://testnet.mirrornode.hedera.com');
    return { txId, mirrorUrl: `${mirrorBase}/api/v1/transactions/${txId}` };
  }
  const submit = await new TopicMessageSubmitTransaction({ topicId, message }).execute(client);
  const receipt = await submit.getReceipt(client);
  const txId = submit.transactionId.toString();
  const mirrorBase = env.HEDERA_MIRROR_BASE_URL || (env.HEDERA_NETWORK === 'mainnet'
    ? 'https://mainnet-public.mirrornode.hedera.com'
    : 'https://testnet.mirrornode.hedera.com');
  return { txId, mirrorUrl: `${mirrorBase}/api/v1/transactions/${txId}?status=${receipt.status.toString()}` };
}

export async function submitAndLog(client: Client | null, topicId: string | undefined, payload: unknown, maxAttempts = 3) {
  let lastErr: any = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { txId, mirrorUrl } = await writeHcsMessage(client, topicId, payload);
      // Persist to HedTxLog
      try {
        const { HedTxLogModel } = await import('../models/HedTxLog.js');
        await HedTxLogModel.create({ type: (payload as any).type || 'unknown', payloadHash: sha256(JSON.stringify(payload)), hederaTxId: txId, mirrorUrl });
      } catch (e) {
        // ignore logging errors
      }
      return { txId, mirrorUrl };
    } catch (err) {
      lastErr = err;
      // simple backoff
      await new Promise((r) => setTimeout(r, 100 * attempt));
    }
  }
  throw lastErr;
}

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function createToken(client: Client, supplyKey: unknown, tokenName='OFDTest', symbol='OFD', decimals=2) {
  const tx = await new TokenCreateTransaction()
    .setTokenName(tokenName)
    .setTokenSymbol(symbol)
    .setDecimals(decimals)
    .setInitialSupply(0)
    .setTreasuryAccountId(env.HEDERA_ACCOUNT_ID!)
    // @ts-expect-error: typed as unknown to keep snippet minimal
    .setSupplyKey(supplyKey)
    .execute(client);
  const receipt = await tx.getReceipt(client);
  return receipt.tokenId?.toString();
}

export async function mintToken(client: Client, tokenId: string, amount: number) {
  const tx = await new TokenMintTransaction().setTokenId(tokenId).setAmount(amount).execute(client);
  return await tx.getReceipt(client);
}

export async function transferToken(client: Client, tokenId: string, from: string, to: string, amount: number) {
  const tx = await new TransferTransaction().addTokenTransfer(tokenId, from, -amount).addTokenTransfer(tokenId, to, amount).execute(client);
  return await tx.getReceipt(client);
}

// NFT helpers for data tokenization (best-effort minimal wiring)
export async function createNftToken(client: Client, tokenName='DATASET', symbol='DS') {
  const tx = await new TokenCreateTransaction()
    .setTokenName(tokenName)
    .setTokenSymbol(symbol)
    .setTokenType(TokenType.NonFungibleUnique)
    .setTreasuryAccountId(env.HEDERA_ACCOUNT_ID!)
    .execute(client);
  const receipt = await tx.getReceipt(client);
  return receipt.tokenId?.toString();
}

export async function mintNft(client: Client, tokenId: string, metadata: Uint8Array[]) {
  const tx = await new TokenMintTransaction().setTokenId(tokenId).setMetadata(metadata).execute(client);
  const receipt = await tx.getReceipt(client);
  // For simplicity we don't return serials here
  return receipt;
}


