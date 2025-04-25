import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Patch,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role, User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User APIs')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('res', createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin-dashboard')
  getAdminData() {
    return 'This is admin data';
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body() body: { role: Role }) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');

    user.role = body.role;
    return this.usersService.updateUser(user);
  }
}
