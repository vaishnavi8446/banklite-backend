import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
  @ApiProperty({ enum: AccountType })
  type: AccountType;
}
