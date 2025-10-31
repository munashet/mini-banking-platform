// src/accounts/accounts.controller.ts
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts (USD & EUR) for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user accounts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No accounts found' })
  async getAccounts(@Request() req) {
    return this.accountsService.getUserAccounts(req.user.userId);
  }
}