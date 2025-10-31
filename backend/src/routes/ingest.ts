import { Router } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse';
import { requireAuth } from '../middleware/auth.js';
import { hederaClient, ensureTopic, writeHcsMessage, sha256 } from '../services/hedera.js';

const upload = multer();
const router = Router();

router.post('/csv', requireAuth(['ngo', 'admin']), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    const rows: Array<Record<string, string>> = [];
    await new Promise<void>((resolve, reject) => {
      parse(req.file!.buffer, { columns: true, trim: true })
        .on('readable', function (this: any) {
          let record;
          // eslint-disable-next-line no-cond-assign
          while ((record = this.read())) rows.push(record);
        })
        .on('error', reject)
        .on('end', () => resolve());
    });
    // Best-effort: publish a batch hash to HCS for provenance
    try {
      const client = hederaClient();
      const topicId = client ? await ensureTopic(client) : undefined;
      const batchHash = sha256(req.file!.buffer.toString('utf8'));
      await writeHcsMessage(client, topicId, { type: 'csv_ingested', rows: rows.length, hash: batchHash, filename: req.file!.originalname });
    } catch (_e) {
      // ignore HCS errors
    }
    // In a full implementation, enqueue jobs per row
    res.status(202).json({ jobId: `mock-${Date.now()}`, status: 'accepted', rows: rows.length });
  } catch (err) {
    next(err);
  }
});

export default router;


