// src/accounts/accounts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async getUserAccounts(userId: string): Promise<Account[]> {
    const accounts = await this.accountRepository.find({
      where: { user: { id: userId } },
      order: { currency: 'ASC' },
    });

    if (!accounts || accounts.length === 0) {
      throw new NotFoundException('No accounts found for this user');
    }

    return accounts;
  }
}