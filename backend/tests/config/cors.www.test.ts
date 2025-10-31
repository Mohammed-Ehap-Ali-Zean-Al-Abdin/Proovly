import type { CorsOptions } from 'cors';

describe('CORS origin allowlist', () => {
  it('allows www apex when apex is explicitly allowed', (done) => {
    // Import the module fresh to use default allowed origins
    jest.isolateModules(() => {
      const { corsOptions } = require('../../src/config/cors') as { corsOptions: CorsOptions };
      const cb = (err: Error | null, allowed?: boolean) => {
        try {
          expect(err).toBeNull();
          expect(allowed).toBe(true);
          done();
        } catch (e) {
          done(e as Error);
        }
      };
      // Should match default apex https://proovly.app via www-variant logic
      const originCheck = corsOptions.origin as unknown as (
        origin: string | undefined,
        callback: (err: Error | null, allowed?: boolean) => void
      ) => void;
      originCheck('https://www.proovly.app', cb);
    });
  });

  it('allows wildcard subdomains when configured', (done) => {
    const prev = process.env.CORS_ORIGINS;
    process.env.CORS_ORIGINS = '*.proovly.app';

    jest.isolateModules(() => {
      const { corsOptions } = require('../../src/config/cors') as { corsOptions: CorsOptions };
      const cb = (err: Error | null, allowed?: boolean) => {
        try {
          expect(err).toBeNull();
          expect(allowed).toBe(true);
          done();
        } catch (e) {
          done(e as Error);
        } finally {
          process.env.CORS_ORIGINS = prev;
        }
      };
      const originCheck = corsOptions.origin as unknown as (
        origin: string | undefined,
        callback: (err: Error | null, allowed?: boolean) => void
      ) => void;
      originCheck('https://sub.proovly.app', cb);
    });
  });

  it('rejects unknown origins', (done) => {
    jest.isolateModules(() => {
      const { corsOptions } = require('../../src/config/cors') as { corsOptions: CorsOptions };
      const cb = (err: Error | null, allowed?: boolean) => {
        try {
          expect(err).toBeInstanceOf(Error);
          expect(allowed).toBeUndefined();
          done();
        } catch (e) {
          done(e as Error);
        }
      };
      const originCheck = corsOptions.origin as unknown as (
        origin: string | undefined,
        callback: (err: Error | null, allowed?: boolean) => void
      ) => void;
      originCheck('https://evil.example.com', cb);
    });
  });
});
