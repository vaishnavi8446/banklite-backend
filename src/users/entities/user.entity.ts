import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { Account } from '../../accounts/entities/account.entity';

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CUSTOMER = 'customer',
}

export enum KycStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  kycStatus: KycStatus;

  @Column({ nullable: true })
  kycPanPath: string;

  @Column({ nullable: true })
  kycAadharPath: string;
}
