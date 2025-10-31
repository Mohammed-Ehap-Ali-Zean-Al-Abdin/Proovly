// Mock the @hashgraph/sdk transaction classes used by the service
// Create spies for SDK transaction methods so we can assert expected calls
const setTokenName = jest.fn(function (this: any, _v: any) { return this; });
const setTokenSymbol = jest.fn(function (this: any, _v: any) { return this; });
const setDecimals = jest.fn(function (this: any, _v: any) { return this; });
const setInitialSupply = jest.fn(function (this: any, _v: any) { return this; });
const setTreasuryAccountId = jest.fn(function (this: any, _v: any) { return this; });
const setSupplyKey = jest.fn(function (this: any, _v: any) { return this; });

const setTokenId = jest.fn(function (this: any, _v: any) { return this; });
const setAmount = jest.fn(function (this: any, _v: any) { return this; });
const addTokenTransfer = jest.fn(function (this: any, _a: any, _b: any) { return this; });

jest.mock('@hashgraph/sdk', () => {
  class MockCreate {
    transactionId = { toString: () => 'tx-123' };
    async execute() {
      return { getReceipt: async () => ({ tokenId: { toString: () => '0.0.999' } }), transactionId: this.transactionId };
    }
    setTokenName = setTokenName;
    setTokenSymbol = setTokenSymbol;
    setDecimals = setDecimals;
    setInitialSupply = setInitialSupply;
    setTreasuryAccountId = setTreasuryAccountId;
    setSupplyKey = setSupplyKey;
  }

  class MockMint {
    async execute() { return { getReceipt: async () => ({ status: 'SUCCESS' }) }; }
    setTokenId = setTokenId;
    setAmount = setAmount;
  }

  class MockTransfer {
    async execute() { return { getReceipt: async () => ({ status: 'SUCCESS' }) }; }
    addTokenTransfer = addTokenTransfer;
  }

  return {
    TokenCreateTransaction: MockCreate,
    TokenMintTransaction: MockMint,
    TransferTransaction: MockTransfer
  };
});

describe('hedera token helpers (mocked SDK)', () => {
  it('createToken returns token id string', async () => {
    const { createToken } = await import('../../src/services/hedera');
    const tokenId = await createToken({} as any, 'supplyKey', 'MyToken', 'MT', 2);
    expect(tokenId).toBe('0.0.999');
    expect(setTokenName).toHaveBeenCalledWith('MyToken');
    expect(setTokenSymbol).toHaveBeenCalledWith('MT');
    expect(setDecimals).toHaveBeenCalledWith(2);
    expect(setInitialSupply).toHaveBeenCalledWith(0);
    // supply key passed through
    expect(setSupplyKey).toHaveBeenCalledWith('supplyKey');
  });

  it('mintToken returns a receipt-like object', async () => {
    // reset spies
    setTokenId.mockClear();
    setAmount.mockClear();
    const { mintToken } = await import('../../src/services/hedera');
    const receipt = await mintToken({} as any, '0.0.999', 1000);
    expect(receipt).toHaveProperty('status');
    expect(setTokenId).toHaveBeenCalledWith('0.0.999');
    expect(setAmount).toHaveBeenCalledWith(1000);
  });

  it('transferToken returns a receipt-like object', async () => {
    setTokenId.mockClear();
    addTokenTransfer.mockClear();
    const { transferToken } = await import('../../src/services/hedera');
    const receipt = await transferToken({} as any, '0.0.999', 'from', 'to', 10);
    expect(receipt).toHaveProperty('status');
    expect(addTokenTransfer).toHaveBeenCalled();
  });
});
