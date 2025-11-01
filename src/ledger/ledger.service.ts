import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { Ledger } from './entities/ledger.entity';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(Ledger)
    private ledgerRepo: Repository<Ledger>,
  ) {}

  async getBalance(accountId: string): Promise<string> {
    const result = await this.ledgerRepo
      .createQueryBuilder('l')
      .select('COALESCE(SUM(CAST(l.amount AS decimal)), 0)', 'bal')
      .where('l.accountId = :id', { id: accountId })
      .getRawOne();
    return result.bal || '0.00';
  }

  async appendEntry(
    account: Account,
    transaction: Transaction,
    amount: string,
    qr: QueryRunner,
  ) {
    const prev = await qr.manager
      .createQueryBuilder(Ledger, 'l')
      .select('COALESCE(SUM(CAST(l.amount AS decimal)), 0)', 'bal')
      .where('l.accountId = :id', { id: account.id })
      .getRawOne();

    const balanceAfter = (parseFloat(prev.bal || '0') + parseFloat(amount)).toFixed(2);

    const entry = qr.manager.create(Ledger, {
      account,
      accountId: account.id,
      transaction,
      transactionId: transaction.id,
      amount,
      balance_after: balanceAfter,
    });
    await qr.manager.save(entry);
  }
}