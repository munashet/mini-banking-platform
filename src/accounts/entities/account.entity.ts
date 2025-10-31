// src/accounts/entities/account.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('accounts')
@Index('idx_accounts_user_currency', ['user', 'currency'], { unique: true })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.accounts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'varchar', length: 3 })
  currency: 'USD' | 'EUR';

  @Column({ type: 'decimal', precision: 15, scale: 2, default: '0.00' })
  balance: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}