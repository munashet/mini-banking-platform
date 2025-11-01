// src/ledger/entities/ledger.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('ledger')
@Index('idx_ledger_account', ['account'])
@Index('idx_ledger_transaction', ['transaction'])
export class Ledger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.ledgerEntries, {
    onDelete: 'CASCADE',
  })
  account: Account;

  @ManyToOne(() => Transaction, (tx) => tx.ledgerEntries, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  balance_after: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}