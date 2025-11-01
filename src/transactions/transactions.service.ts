// src/transactions/transactions.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { LedgerService } from '../ledger/ledger.service';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    private ledgerService: LedgerService,
  ) {}

  async transfer(fromUserId: string, dto: TransferDto): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fromAccount = await queryRunner.manager.findOne(Account, {
        where: { user: { id: fromUserId }, currency: dto.currency },
        lock: { mode: 'pessimistic_write' },
      });

      const toAccount = await queryRunner.manager.findOne(Account, {
        where: { user: { id: dto.toUserId }, currency: dto.currency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!fromAccount || !toAccount) throw new NotFoundException('Account not found');
      if (fromAccount.id === toAccount.id) throw new BadRequestException('Cannot transfer to self');

      const amountStr = dto.amount.toFixed(2);
      const balance = await this.ledgerService.getBalance(fromAccount.id);
      if (parseFloat(balance) < dto.amount) throw new BadRequestException('Insufficient funds');

      const tx = queryRunner.manager.create(Transaction, {
        type: TransactionType.TRANSFER,
        metadata: { fromUserId, toUserId: dto.toUserId, amount: amountStr, currency: dto.currency },
      });
      await queryRunner.manager.save(tx);

      await this.ledgerService.appendEntry(fromAccount, tx, `-${amountStr}`, queryRunner);
      await this.ledgerService.appendEntry(toAccount, tx, amountStr, queryRunner);

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