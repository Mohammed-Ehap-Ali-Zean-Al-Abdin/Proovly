import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { hederaClient, ensureTopic, writeHcsMessage, sha256 } from '../services/hedera.js';

const router = Router();

router.post('/sql', requireAuth(['admin']), async (req, res, next) => {
  try {
    const { connectionString, query } = req.body || {};
    if (!connectionString || !query) return res.status(400).json({ error: 'connectionString and query required' });
    let rows: unknown[] = [];
    try {
      // Dynamic import via Function to avoid TS module resolution at build time
      // eslint-disable-next-line no-new-func
      const dynImport = Function('m', 'return import(m)');
      const pg: any = await (dynImport('pg') as Promise<any>).catch(() => null);
      if (!pg) return res.status(503).json({ error: 'SQL connector not installed' });
      const { Client } = pg;
      const client = new Client({ connectionString });
      await client.connect();
      const result = await client.query(query);
      rows = result.rows || [];
      await client.end();
    } catch (err) {
      return res.status(502).json({ error: 'SQL query failed', detail: (err as Error).message });
    }
    // Publish a hash of the JSON-serialized rows to HCS
    try {
      const hClient = hederaClient();
      const topicId = hClient ? await ensureTopic(hClient) : undefined;
      const json = JSON.stringify(rows);
      const hash = sha256(json);
      await writeHcsMessage(hClient, topicId, { type: 'sql_ingested', rows: Array.isArray(rows) ? rows.length : 0, hash });
    } catch (_e) {
      // ignore
    }
    res.status(202).json({ status: 'accepted', rows: Array.isArray(rows) ? rows.length : 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
