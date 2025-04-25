import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'vaishnavi@example.com' })
  email: string;

  @ApiProperty({ example: 'SecureP@ssw0rd123' })
  password: string;
}
