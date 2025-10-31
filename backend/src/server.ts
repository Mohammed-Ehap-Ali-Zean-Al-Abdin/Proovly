import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectMongo } from './config/mongo.js';

const server = http.createServer(app);

const port = env.PORT;

// Connect to MongoDB, then start the server. If DB connection fails we still start
// the server (so introspection endpoints remain available) but we log the error.
connectMongo()
  .then(() => {
    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on port ${port}`);
    });
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('Mongo connection failed:', e.message);
    // Still start the server so the process is reachable for health checks
    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening (without DB) on port ${port}`);
    });
  });

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection', reason);
});


