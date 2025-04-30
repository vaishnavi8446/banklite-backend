import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,

    private dataSource: DataSource,
  ) {}

  // Deposit money
  async deposit(accountId: string, amount: number) {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new BadRequestException('Amount must be a valid positive number');
    }

    const account = await this.accountRepo.findOne({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.balance += numericAmount;
    await this.accountRepo.save(account);

    const transaction = this.transactionRepo.create({
      account,
      type: TransactionType.DEPOSIT,
      amount: numericAmount,
    });
    return this.transactionRepo.save(transaction);
  }

  // Withdraw money
  async withdraw(accountId: string, amount: number) {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new BadRequestException('Amount must be a valid positive number');
    }

    const account = await this.accountRepo.findOne({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance < numericAmount) {
      throw new BadRequestException('Insufficient balance');
    }

    account.balance -= numericAmount;
    await this.accountRepo.save(account);

    const transaction = this.transactionRepo.create({
      account,
      type: TransactionType.WITHDRAW,
      amount: numericAmount,
    });
    return this.transactionRepo.save(transaction);
  }

  // Transfer between accounts
  async transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ) {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new BadRequestException('Amount must be a valid positive number');
    }

    await this.dataSource.transaction(async (manager) => {
      const fromAccount = await manager.findOne(Account, {
        where: { id: fromAccountId },
      });
      const toAccount = await manager.findOne(Account, {
        where: { id: toAccountId },
      });

      if (!fromAccount || !toAccount) {
        throw new NotFoundException('Source or destination account not found');
      }

      if (fromAccount.balance < numericAmount) {
        throw new BadRequestException('Insufficient balance');
      }

      fromAccount.balance -= numericAmount;
      toAccount.balance += numericAmount;

      await manager.save(fromAccount);
      await manager.save(toAccount);

      const transaction = this.transactionRepo.create({
        amount: numericAmount,
        fromAccount,
        toAccount,
        type: TransactionType.TRANSFER,
      });
      const data = await manager.save(transaction);
      return { message: 'Transfer successful' };
    });
  }

  async getTransactionHistory(filters: {
    accountId?: string;
    type?: TransactionType;
    startDate?: string;
    endDate?: string;
  }) {
    const where: FindOptionsWhere<Transaction> = {};

    if (filters.accountId) {
      where.account = { id: filters.accountId };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.startDate && filters.endDate) {
      where.createdAt = Between(
        new Date(filters.startDate),
        new Date(filters.endDate),
      );
    }

    return this.transactionRepo.find({
      where,
      relations: ['account', 'fromAccount', 'toAccount'],
      order: { createdAt: 'DESC' },
    });
  }
}
