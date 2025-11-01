// src/database/seed.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // ONLY LOAD User and Account entities
    entities: [
      'src/auth/entities/user.entity.ts',
      'src/accounts/entities/account.entity.ts',
    ],
    logging: false,
  });

  await dataSource.initialize();

  const userRepo = dataSource.getRepository('User');
  const accountRepo = dataSource.getRepository('Account');

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

    await accountRepo.save([
      { user, currency: 'USD', balance: '1000.00' },
      { user, currency: 'EUR', balance: '500.00' },
    ]);
  }

  console.log('Seeded 3 users with USD/EUR accounts');
  await dataSource.destroy();
}

seed().catch(console.error);