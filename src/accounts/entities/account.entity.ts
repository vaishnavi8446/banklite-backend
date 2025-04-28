import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';

export enum AccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Column()
  accountNumber: String;

  @Column({ type: 'enum', enum: AccountType })
  type: AccountType;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;
  transactions: any;
}
