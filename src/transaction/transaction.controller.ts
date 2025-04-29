import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit/:accountId')
  @ApiOperation({ summary: 'Deposit money into an account' })
  @ApiResponse({ status: 201, description: 'Deposit successful.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid amount or account not found.',
  })
  async deposit(
    @Param('accountId') accountId: string,
    @Body() depositDto: DepositDto,
  ) {
    try {
      return await this.transactionsService.deposit(
        accountId,
        depositDto.amount,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('withdraw/:accountId')
  @ApiOperation({ summary: 'Withdraw money from an account' })
  @ApiResponse({ status: 201, description: 'Withdrawal successful.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid amount, insufficient balance, or account not found.',
  })
  async withdraw(
    @Param('accountId') accountId: string,
    @Body() withdrawDto: WithdrawDto,
  ) {
    try {
      return await this.transactionsService.withdraw(
        accountId,
        withdrawDto.amount,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('transfer')
  async transfer(
    @Body() transferDto: TransferDto,
  ) {
    return this.transactionsService.transferFunds(
      transferDto.fromAccountId,
      transferDto.toAccountId,
      transferDto.amount,
    );
  }
}
