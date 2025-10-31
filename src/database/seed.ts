// src/database/seed.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Account],
    logging: false,
  });

  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const accountRepo = dataSource.getRepository(Account);

  // Clear existing data
  await accountRepo.delete({});
  await userRepo.delete({});

  const saltRounds = 10;
  const users = [
    { email: 'alice@example.com', name: 'Alice', password: 'password123' },
    { email: 'bob@example.com', name: 'Bob', password: 'password123' },
    { email: 'charlie@example.com', name: 'Charlie', password: 'password123' },
  ];

  for (const userData of users) {
    const password_hash = await bcrypt.hash(userData.password, saltRounds);
    const user = userRepo.create({ ...userData, password_hash });
    await userRepo.save(user);

    // Create USD & EUR accounts
    const usd = accountRepo.create({ user, currency: 'USD', balance: '1000.00' });
    const eur = accountRepo.create({ user, currency: 'EUR', balance: '500.00' });
    await accountRepo.save([usd, eur]);
  }

  console.log('3 users seeded with USD: $1000.00, EUR: €500.00');
  await dataSource.destroy();
}

seed().catch(console.error);