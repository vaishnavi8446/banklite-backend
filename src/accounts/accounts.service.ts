import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { User } from '../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async openAccount(createDto: CreateAccountDto, user: User): Promise<Account> {
    console.log('begin', createDto, user.id);
    const userData = await this.userRepo.findOne({ where: { id: user.id } });
    if (!userData) {
      throw new Error('User not found');
    }

    const account = this.accountRepo.create({
      ...createDto,
      user,
      balance: createDto.initialDeposit || 0,
      accountNumber: `ACC-${uuidv4().split('-')[0]}`,
    });
    return this.accountRepo.save(account);
  }

  async getAllAccounts() {
    return this.accountRepo.find({
      relations: ['user'],
    });
  }

  // ✅ List accounts for logged-in user
  async getAccountsForUser(userId: string) {
    return this.accountRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
