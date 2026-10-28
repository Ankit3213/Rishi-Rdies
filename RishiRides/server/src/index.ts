import 'dotenv/config';
import { app } from './app';
import { config } from './config';
import { closeDatabase, connectDatabase } from './db';

async function start() {
  await connectDatabase();
  const server = app.listen(config.PORT, () => {
    console.info(`RishiRides auth API listening on port ${config.PORT}`);
  });

  const shutdown = () => {
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

void start().catch((error: unknown) => {
  console.error('Could not start the API', error instanceof Error ? error.message : 'Unknown error');
  process.exitCode = 1;
});
