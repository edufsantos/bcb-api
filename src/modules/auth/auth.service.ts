import { User, Prisma } from '.prisma/client';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthErrors } from 'src/shared/errors/auth.errors';
import { CommonErrors } from 'src/shared/errors/common.errors';
import { PrismaService } from '../../prisma.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { CreateCustomerAccountDto } from './dtos/create-customer-account.dto';
import { UserSerializer } from './user-serializer';

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
        emailVerified: isDevelopment,
      },
    });
    if (user && !isDevelopment) {
      delete user.password;
      return user;
    }
    return null;
  }

  async createCustomer(data: CreateCustomerAccountDto) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const { password, planId, ...userData } = data;
    const bcryptSalt = await bcrypt.genSalt();
    const encrypted_password = await bcrypt.hash(password, bcryptSalt);
    delete userData.password_confirmation;

    const isValidPlan = planId
      ? await this.prisma.posPaidPlan.findUniqueOrThrow({
          where: { id: planId ?? '' },
        })
      : false;

    const user = await this.prisma.customer.create({
      data: {
        ...userData,
        password: encrypted_password,
        planPayment: isValidPlan ? 'POS' : 'PRE',
        emailVerified: isDevelopment,
        posPaidPlan: isValidPlan
          ? {
              connect: {
                id: planId,
              },
            }
          : undefined,
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
    scope: 'user' | 'customer',
  ): Promise<Pick<User, 'id' | 'emailVerified'> | null> {
    const findArgs = {
      where: { email },
      select: {
        id: true,
        emailVerified: true,
        email: true,
        password: true,
        ...(scope === 'customer' && { active: true }),
      },
    };

    const user =
      scope === 'customer'
        ? await this.prisma.customer.findUnique(findArgs)
        : await this.prisma.user.findUnique(findArgs);

    if (!user) throw new UnauthorizedException(AuthErrors.AccountNotFound);
    if (!user.active && scope === 'customer')
      throw new UnauthorizedException(AuthErrors.YourAccountIsNotActive);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user;
    }
    throw new UnauthorizedException(AuthErrors.AccountNotFound);
  }

  async currrentUser(id: string) {
    const findArgs = {
      where: { id },
    };

    const customer = await this.prisma.customer.findUnique(findArgs);
    const user = await this.prisma.user.findUnique(findArgs);

    if (!user && !customer)
      throw new BadRequestException(CommonErrors.NotFound);

    return new UserSerializer(user ?? customer);
  }
}
