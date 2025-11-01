// src/transactions/transactions.controller.ts
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller({ path: 'transactions', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TransactionsController {
  constructor(private txService: TransactionsService) {}

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money to another user (same currency)' })
  async transfer(@Request() req, @Body() dto: TransferDto) {
    return this.txService.transfer(req.user.userId, dto);
  }
}