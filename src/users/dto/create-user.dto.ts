import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Vaishnavi Ambolkar' })
  name: string;

  @ApiProperty({ example: 'vaishnavi@example.com' })
  email: string;

  @ApiProperty({ example: 'SecureP@ssw0rd123' })
  password: string;

  @ApiProperty({ example: '+919876543210' })
  phone_number: string;

  @ApiProperty({
    enum: ['admin', 'customer', 'manager'],
    required: false,
    example: 'customer',
  })
  role?: string;
}
