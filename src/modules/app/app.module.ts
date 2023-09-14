import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../../modules/auth/auth.module';
import { PrismaService } from '../../prisma.service';
import { HttpExceptionFilter } from '../../shared/exception-filters/http-exception.filter';
import { PrismaClientKnownRequestErrorExceptionFilter } from '../../shared/exception-filters/prisma-client-known-request-error-exception.filter';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AppController } from './app.controller';
import { CustomersController } from './custumers/custumers.controller';
import { CustomersService } from './custumers/custumers.service';
import { PosPaidPlanController } from './pos-paid-plan/pos-paid-plan.controller';
import { PosPaidPlanService } from './pos-paid-plan/pos-paid-plan.service';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [
    CustomersController,
    MessagesController,
    AppController,
    PosPaidPlanController,
  ],
  providers: [
    PrismaService,
    CustomersService,
    PosPaidPlanService,
    MessagesService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
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
