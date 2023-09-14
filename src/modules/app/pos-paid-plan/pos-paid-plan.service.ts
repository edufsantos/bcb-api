import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePosPaidPlanDto } from './create-pos-paid-plan.dto';
import { UpdatePosPaidPlanDto } from './update-pos-paid-plan.dto';
import { PrismaService } from 'src/prisma.service';
import { LinkPosPaidPlanDto } from './link-pos-paid-plan.dto';
import { PlanQuery } from './plan.query';
import { Prisma } from '@prisma/client';

@Injectable()
export class PosPaidPlanService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePosPaidPlanDto) {
    return this.prisma.posPaidPlan.create({
      data,
    });
  }

  async findAll({ take, skip, orderBy, search }: PlanQuery) {
    if (search?.title) search.title.mode = 'insensitive';
    const where: Prisma.PosPaidPlanWhereInput = search;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.posPaidPlan.count({ where }),
      this.prisma.posPaidPlan.findMany({
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
    return this.prisma.posPaidPlan.findUnique({ where: { id } });
  }

  update(id: string, data: UpdatePosPaidPlanDto) {
    return this.prisma.posPaidPlan.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.posPaidPlan.delete({ where: { id } });
  }

  async linkToCustomer(data: LinkPosPaidPlanDto) {
    return this.prisma.posPaidPlan.update({
      where: {
        id: data.posPaidPlanId,
      },
      include: { customer: true },
      data: {
        customer: {
          connect: data.customers,
        },
      },
    });
  }

  async connectToCustomer(id, posPaidPlanId) {
    return this.prisma.$transaction(async (transaction) => {
      const where = { id };
      const customer = await this.prisma.customer.findUnique({ where });
      if (customer.posPaidPlanId === posPaidPlanId)
        throw new BadRequestException('UserAlreadyHaveThisPlan');
      return transaction.customer.update({
        where,
        data: {
          posPaidPlan: {
            connect: {
              id: posPaidPlanId,
            },
          },
        },
      });
    });
  }

  async disconnectToCustomer(id) {
    return this.prisma.$transaction(async (transaction) => {
      const where = { id };
      const customer = await this.prisma.customer.findUnique({ where });
      if (!customer.posPaidPlanId)
        throw new BadRequestException('UserDontHavePlanActive');
      return transaction.customer.update({
        where,
        data: {
          planPayment: 'PRE',
          posPaidPlan: {
            disconnect: true,
          },
        },
      });
    });
  }
}
