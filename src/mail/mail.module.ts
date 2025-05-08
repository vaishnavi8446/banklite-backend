import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  controllers: [MailService],
  providers: [MailService],
})
export class MailModule {}
