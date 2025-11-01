import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('ledger')
@Index('idx_ledger_account', ['accountId'])
@Index('idx_ledger_transaction', ['transactionId'])
export class Ledger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, account => account.ledgerEntries, { onDelete: 'CASCADE' })
  account: Account;

  @Column('uuid')
  accountId: string;

  @ManyToOne(() => Transaction, tx => tx.ledgerEntries, { onDelete: 'CASCADE' })
  transaction: Transaction;

  @Column('uuid')
  transactionId: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: string;

  @Column('decimal', { precision: 15, scale: 2 })
  balance_after: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}