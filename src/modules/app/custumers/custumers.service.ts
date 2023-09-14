import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomerAccountDto } from 'src/modules/auth/dtos/create-customer-account.dto';
import { CustomerQuery } from './customer.query';
import { Prisma } from '@prisma/client';
import { UpdateCustomerDto } from './update-custumers.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll({ skip, take, orderBy, search }: CustomerQuery) {
    if (search?.name) search.name.mode = 'insensitive';

    const where: Prisma.CustomerWhereInput = search;

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        orderBy: {
          ...orderBy,
          created_at: 'desc',
        },
        where,
        skip,
        take,
      }),
    ]);

    return { count, skip, take, rows };
  }

  findOne(id: string) {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  update(id: string, { posPaidPlanId, ...data }: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data: {
        ...data,
        planPayment: posPaidPlanId ? 'POS' : 'PRE',
        posPaidPlan: {
          connect: {
            id: posPaidPlanId,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.customer.delete({ where: { id } });
  }
}
