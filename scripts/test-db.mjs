import 'dotenv/config';
import mongoose from 'mongoose';

async function main() {
  const url = process.env.MONGODB_URL;
  if (!url) {
    console.error('ERROR: MONGODB_URL must be set in .env');
    process.exit(1);
  }

  try {
    const startedAt = Date.now();
    await mongoose.connect(url, { bufferCommands: false });
    const elapsed = Date.now() - startedAt;

    const dbName = mongoose.connection?.name || '(unknown)';
    const host = mongoose.connection?.host || '(unknown)';

    console.log(`OK: Connected to MongoDB [db="${dbName}", host="${host}", time=${elapsed}ms]`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('ERROR: Database connection failed');
    console.error(err);
    try { await mongoose.connection.close(); } catch {}
    process.exit(1);
  }
}

main();