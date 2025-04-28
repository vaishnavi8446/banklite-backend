import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({
    description: 'Amount to deposit into the account',
    type: 'number',
    example: 500,
  })
  amount: number;
}
