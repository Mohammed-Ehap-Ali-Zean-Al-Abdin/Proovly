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

// Configure Helmet with relaxed CSP for Swagger UI to work with CDN assets
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
    },
  },
}));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

// Root endpoint to verify the API domain is serving this backend (useful for Vercel checks)
// Returns whether OpenAPI docs are available at /api-docs so you can quickly verify MIME
app.get('/', (_req, res) => {
  try {
    const openapiPath = path.join(process.cwd(), 'openapi', 'openapi.yaml');
    const hasOpenApi = fs.existsSync(openapiPath);
    return res.status(200).json({ ok: true, openapi: hasOpenApi, docs: hasOpenApi ? '/api-docs' : null });
  } catch (err) {
    return res.status(200).json({ ok: true, openapi: false, docs: null });
  }
});


// API routes
app.use('/api/v1', api);

// OpenAPI docs - Custom HTML to work on Vercel serverless
const openapiPath = path.join(process.cwd(), 'openapi', 'openapi.yaml');
if (fs.existsSync(openapiPath)) {
  const swaggerDocument = fs.readFileSync(openapiPath, 'utf8');
  const docObj = YAML.parse(swaggerDocument);
  
  // Serve spec as JSON
  app.get('/api-docs/spec.json', (_req, res) => {
    res.json(docObj);
  });

  // Serve custom Swagger UI HTML (doesn't rely on node_modules static files)
  app.get('/api-docs', (_req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Proovly API Documentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "/api-docs/spec.json",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
    `);
  });
}

export default app;


