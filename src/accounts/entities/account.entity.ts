import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Ledger } from '../../ledger/entities/ledger.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.accounts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 3 })
  currency: 'USD' | 'EUR';

  @OneToMany(() => Ledger, ledger => ledger.account)
  ledgerEntries: Ledger[];
}