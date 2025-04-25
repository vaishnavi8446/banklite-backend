import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, AccountType } from './entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { User } from '../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  async openAccount(createDto: CreateAccountDto, user: User): Promise<Account> {
    const account = this.accountRepo.create({
      ...createDto,
      user,
      accountNumber: `ACC-${uuidv4().split('-')[0]}`,
    });
    return this.accountRepo.save(account);
  }
}
