import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from '../../shared/decorators/public.decorator';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('create-account')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.createAccount(createAccountDto);
  }
}
