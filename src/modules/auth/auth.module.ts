import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfig } from './jwt/jwt.config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
