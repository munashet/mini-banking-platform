// src/transactions/transactions.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Ledger } from '../ledger/entities/ledger.entity';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(Transaction)
    private txRepo: Repository<Transaction>,
  ) {}

  async transfer(
    fromUserId: string,
    dto: TransferDto,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Lock accounts
      const fromAccount = await queryRunner.manager.findOne(Account, {
        where: { user: { id: fromUserId }, currency: dto.currency },
        lock: { mode: 'pessimistic_write' },
      });

      const toAccount = await queryRunner.manager.findOne(Account, {
        where: { user: { id: dto.toUserId }, currency: dto.currency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!fromAccount || !toAccount) {
        throw new NotFoundException('Account not found');
      }

      if (fromAccount.id === toAccount.id) {
        throw new BadRequestException('Cannot transfer to self');
      }

      const amount = dto.amount.toFixed(2);
      const fromBalance = parseFloat(fromAccount.balance);
      if (fromBalance < parseFloat(amount)) {
        throw new BadRequestException('Insufficient funds');
      }

      // 2. Update balances
      fromAccount.balance = (fromBalance - parseFloat(amount)).toFixed(2);
      toAccount.balance = (parseFloat(toAccount.balance) + parseFloat(amount)).toFixed(2);

      await queryRunner.manager.save([fromAccount, toAccount]);

      // 3. Create transaction
      const tx = queryRunner.manager.create(Transaction, {
        type: 'transfer' as TransactionType,
        metadata: { fromUserId, toUserId: dto.toUserId, amount, currency: dto.currency },
      });
      await queryRunner.manager.save(tx);

      // 4. Create ledger entries
      const debit = queryRunner.manager.create(Ledger, {
        account: fromAccount,
        transaction: tx,
        amount: `-${amount}`,
        balance_after: fromAccount.balance,
      });

      const credit = queryRunner.manager.create(Ledger, {
        account: toAccount,
        transaction: tx,
        amount,
        balance_after: toAccount.balance,
      });

      await queryRunner.manager.save([debit, credit]);

      await queryRunner.commitTransaction();
      return tx;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}