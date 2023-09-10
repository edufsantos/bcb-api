import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AclGuard } from 'src/modules/app/acl.guard';
import { AuthModule } from '../../modules/auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PrismaService } from '../../prisma.service';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { PrismaClientKnownRequestErrorExceptionFilter } from '../../shared/exception-filters/prisma-client-known-request-error-exception.filter';
import { HttpExceptionFilter } from '../../shared/exception-filters/http-exception.filter';
import { UsersService } from './users/users.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UsersController, AppController],
  providers: [
    PrismaService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AclGuard,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientKnownRequestErrorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
