import { User } from '.prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AuthErrors } from 'src/shared/errors/auth.errors';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async login(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createAccount(data: CreateAccountDto) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const { password, ...userData } = data;
    const bcryptSalt = await bcrypt.genSalt();
    const encrypted_password = await bcrypt.hash(password, bcryptSalt);
    delete userData.password_confirmation;
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: encrypted_password,
        email_verified: isDevelopment,
      },
    });
    if (user && !isDevelopment) {
      delete user.password;
      return user;
    }
    return null;
  }

  async createCustomer(data: CreateAccountDto) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const { password, ...userData } = data;
    const bcryptSalt = await bcrypt.genSalt();
    const encrypted_password = await bcrypt.hash(password, bcryptSalt);
    delete userData.password_confirmation;
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: encrypted_password,
        email_verified: isDevelopment,
      },
    });
    if (user && !isDevelopment) {
      delete user.password;
      return user;
    }
    return null;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<User, 'id' | 'email_verified'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email_verified: true, email: true, password: true },
    });
    if (!user) throw new UnauthorizedException(AuthErrors.EmailNotFound);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user;
    }
    throw new UnauthorizedException(AuthErrors.InvalidPassword);
  }
}
