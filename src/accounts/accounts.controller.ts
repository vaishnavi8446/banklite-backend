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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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

  @Get()
  async listUserAccounts(@Request() req) {
    return this.accountsService.getAccountsForUser(req.user.id);
  }
}
