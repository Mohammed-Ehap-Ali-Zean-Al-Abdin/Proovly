import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import { corsOptions } from './config/cors.js';
import api from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

// Note: DB connection is started by `src/server.ts` when running the app.

// API routes
app.use('/api/v1', api);

// OpenAPI docs
// Resolve from current working directory; when running inside backend/, this will be backend/openapi/openapi.yaml
const openapiPath = path.join(process.cwd(), 'openapi', 'openapi.yaml');
if (fs.existsSync(openapiPath)) {
  const swaggerDocument = fs.readFileSync(openapiPath, 'utf8');
  const docObj = YAML.parse(swaggerDocument);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docObj));
}

export default app;


