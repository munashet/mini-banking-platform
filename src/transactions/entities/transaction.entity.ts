// src/transactions/entities/transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Ledger } from '../../ledger/entities/ledger.entity';

export type TransactionType = 'transfer' | 'exchange';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  type: TransactionType;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => Ledger, (ledger) => ledger.transaction, {
    cascade: true,
  })
  ledgerEntries: Ledger[];
}