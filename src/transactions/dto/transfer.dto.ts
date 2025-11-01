// src/transactions/dto/transfer.dto.ts
import { IsUUID, IsEnum, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
}

export class TransferDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  @IsUUID()
  toUserId: string;

  @ApiProperty({ example: 'USD', enum: Currency })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: 100.5 })
  @IsPositive()
  @Max(999999999)
  amount: number;
}