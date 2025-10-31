import { writeHcsMessageProcessor } from '../../src/workers/index';

describe('worker processors', () => {
  it('writeHcsMessageProcessor returns expected shape', async () => {
    const fakeJob = { data: { foo: 'bar' } } as any;
    const res = await writeHcsMessageProcessor(fakeJob);
    expect(res).toEqual({ ok: true, received: { foo: 'bar' } });
  });
});
