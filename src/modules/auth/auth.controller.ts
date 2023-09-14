import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../../shared/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard, LocalCustomerAuthGuard } from './local-auth.guard';
import { CreateAccountDto } from './dtos/create-account.dto';
import { CreateCustomerAccountDto } from './dtos/create-customer-account.dto';

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
  @UseGuards(LocalCustomerAuthGuard)
  @Post('login-customer')
  async loginCustomer(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('create-account')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return await this.authService.createAccount(createAccountDto);
  }

  @Public()
  @Post('create-customer-account')
  async createCustomerAccount(
    @Body() createAccountDto: CreateCustomerAccountDto,
  ) {
    return await this.authService.createCustomer(createAccountDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('current')
  async findCurrentUser(@Req() req) {
    return this.authService.currrentUser(req.user.id);
  }
}
