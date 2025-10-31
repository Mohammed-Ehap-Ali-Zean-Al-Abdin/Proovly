import { Client, ContractExecuteTransaction, ContractFunctionParameters, ContractCallQuery } from '@hashgraph/sdk';

// Minimal HSCS helpers with graceful fallback
export async function putAnalyticsHash(client: Client | null, contractId: string | undefined, key: string, hash: string) {
  if (!client || !contractId) return { simulated: true };
  const tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(200000)
    .setFunction('putHash', new ContractFunctionParameters().addString(key).addString(hash))
    .execute(client);
  await tx.getReceipt(client);
  return { simulated: false };
}

export async function getAnalyticsHash(client: Client | null, contractId: string | undefined, key: string): Promise<{ hash: string | null; simulated: boolean }> {
  if (!client || !contractId) return { hash: null, simulated: true };
  const query = await new ContractCallQuery()
    .setContractId(contractId)
    .setGas(200000)
    .setFunction('getHash', new ContractFunctionParameters().addString(key))
    .execute(client);
  const result = query.getString(0);
  return { hash: result || null, simulated: false };
}
