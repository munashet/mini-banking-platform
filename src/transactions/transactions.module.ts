// src/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { Ledger } from '../ledger/entities/ledger.entity';
import { Account } from '../accounts/entities/account.entity';
import { LedgerModule } from '../ledger/ledger.module';  // ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Ledger, Account]),
    LedgerModule,  // ADD THIS
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}