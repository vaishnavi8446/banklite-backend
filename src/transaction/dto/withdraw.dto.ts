import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({
    description: 'Amount to withdraw from the account',
    type: 'number',
    example: 200,
  })
  amount: number;
}
