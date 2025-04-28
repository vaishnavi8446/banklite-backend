import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  // Deposit money
  async deposit(accountId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const account = await this.accountRepo.findOne({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.balance += amount;
    await this.accountRepo.save(account);

    const transaction = this.transactionRepo.create({
      account,
      type: TransactionType.DEPOSIT,
      amount,
    });
    return this.transactionRepo.save(transaction);
  }

  // Withdraw money
  async withdraw(accountId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const account = await this.accountRepo.findOne({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    account.balance -= amount;
    await this.accountRepo.save(account);

    const transaction = this.transactionRepo.create({
      account,
      type: TransactionType.WITHDRAW,
      amount,
    });
    return this.transactionRepo.save(transaction);
  }
}
