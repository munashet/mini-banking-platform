// src/database/seed.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // DO NOT list entities here → we’ll use raw queries
    logging: true,
    synchronize: false, // keep false in prod
  });

  await dataSource.initialize();
  const qr = dataSource.createQueryRunner();
  await qr.connect();

  try {
    // 1. Clean tables (order matters because of FK)
    await qr.query(`DELETE FROM ledger`);
    await qr.query(`DELETE FROM accounts`);
    await qr.query(`DELETE FROM users`);

    const saltRounds = 10;
    const users = [
      { email: 'alice@example.com', name: 'Alice', password: 'password123' },
      { email: 'bob@example.com',   name: 'Bob',   password: 'password123' },
      { email: 'charlie@example.com', name: 'Charlie', password: 'password123' },
    ];

    for (const u of users) {
      const password_hash = await bcrypt.hash(u.password, saltRounds);
      const userId = uuidv4();

      // Insert user
      await qr.query(
        `INSERT INTO users (id, email, name, password_hash, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, u.email, u.name, password_hash]
      );

      // Insert USD account
      const usdId = uuidv4();
      await qr.query(
        `INSERT INTO accounts (id, "userId", currency)
         VALUES ($1, $2, $3)`,
        [usdId, userId, 'USD']
      );

      // Insert EUR account
      const eurId = uuidv4();
      await qr.query(
        `INSERT INTO accounts (id, "userId", currency)
         VALUES ($1, $2, $3)`,
        [eurId, userId, 'EUR']
      );

      // Seed initial balances via ledger (double-entry)
      const txId = uuidv4();
      await qr.query(
        `INSERT INTO transactions (id, type, metadata, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [txId, 'deposit', JSON.stringify({ seed: true })]
      );

      // USD entry
      await qr.query(
        `INSERT INTO ledger (id, "accountId", "transactionId", amount, balance_after, created_at)
         VALUES ($1, $2, $3, $4, $4, NOW())`,
        [uuidv4(), usdId, txId, '1000.00']
      );

      // EUR entry
      await qr.query(
        `INSERT INTO ledger (id, "accountId", "transactionId", amount, balance_after, created_at)
         VALUES ($1, $2, $3, $4, $4, NOW())`,
        [uuidv4(), eurId, txId, '500.00']
      );
    }

    console.log('Seeded 3 users with USD (1000) + EUR (500) accounts');
  } catch (err) {
    console.error('Seed failed:', err);
    throw err;
  } finally {
    await qr.release();
    await dataSource.destroy();
  }
}

seed().catch(console.error);