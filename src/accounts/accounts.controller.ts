import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';

@ApiTags('accounts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('open')
  openAccount(@Body() body: CreateAccountDto, @Request() req) {
    return this.accountsService.openAccount(body, req.user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin') // ✅ Only Admin can access
  @Get()
  async listAllAccounts(@Request() req) {
    return this.accountsService.getAllAccounts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me') //list only my own accounts (for normal user)
  async listMyAccounts(@Request() req) {
    return this.accountsService.getAccountsForUser(req.user.id);
  }
}
