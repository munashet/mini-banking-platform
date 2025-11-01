-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Accounts (one per user per currency)
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  currency VARCHAR(3) CHECK (currency IN ('USD', 'EUR')),
  balance DECIMAL(15,2) DEFAULT 0.00,
  UNIQUE(user_id, currency)
);

-- Ledger Entries (Double-Entry)
CREATE TABLE ledger (
  id BIGSERIAL PRIMARY KEY,
  transaction_id INT NOT NULL,
  account_id INT REFERENCES accounts(id),
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions (User-facing history)
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) CHECK (type IN ('transfer', 'exchange')),
  status VARCHAR(20) DEFAULT 'completed',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);