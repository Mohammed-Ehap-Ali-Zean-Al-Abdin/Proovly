import { Router } from 'express';
import donations from './donations.js';
import auth from './auth.js';
import ofd from './ofd.js';
import ofdRecords from './ofd_records.js';
import ingest from './ingest.js';
import analytics from './analytics.js';
import transactions from './transactions.js';
import ofdPositions from './ofd_positions.js';
import payments from './payments.js';
import analyticsContract from './analytics_contract.js';
import ingestSql from './ingest_sql.js';
import dataTokens from './data_tokens.js';
import media from './media.js';
import cloudinary from './cloudinary.js';
import users from './users.js';

const api = Router();

api.use('/donations', donations);
api.use('/auth', auth);
api.use('/users', users);
api.use('/ofd', ofd);
api.use('/ofd-records', ofdRecords);
api.use('/ingest', ingest);
api.use('/ingest', ingestSql);
api.use('/analytics', analytics);
api.use('/analytics/contract', analyticsContract);
api.use('/transactions', transactions);
api.use('/ofd/positions', ofdPositions);
api.use('/payments', payments);
api.use('/data-tokens', dataTokens);
api.use('/media', media);
api.use('/cloudinary', cloudinary);

export default api;


