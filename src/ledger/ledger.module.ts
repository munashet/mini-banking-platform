// src/ledger/ledger.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ledger } from './entities/ledger.entity';
import { LedgerService } from './ledger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ledger])],
  providers: [LedgerService],
  exports: [LedgerService],  // THIS IS REQUIRED
})
export class LedgerModule {}