import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// name 'local' is defined by passport-local lib
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

export class LocalCustomerAuthGuard extends AuthGuard('local-customer') {}
