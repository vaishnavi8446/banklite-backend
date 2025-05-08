// src/kyc/kyc.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { User } from '../users/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, MailModule])],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
