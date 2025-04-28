import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionModule {}
