import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './create-message.dto';
import { UpdateMessageDto } from './update-message.dto';
import { PrismaService } from 'src/prisma.service';
import { AuthErrors } from 'src/shared/errors/auth.errors';
import { CommonErrors } from 'src/shared/errors/common.errors';
import { MessagesQuery } from './messages.query';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1);
  }

  getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0);
  }

  async sendMessage(createMessageDto: CreateMessageDto, userId: string) {
    const date = new Date();

    const firstDay = this.getFirstDayOfMonth(
      date.getFullYear(),
      date.getMonth(),
    );

    const lastDayCurrentMonth = this.getLastDayOfMonth(
      date.getFullYear(),
      date.getMonth(),
    );

    return await this.prisma.$transaction(async (transaction) => {
      const user = await transaction.customer.findUnique({
        where: { id: userId },
        include: {
          posPaidPlan: {
            select: {
              balanceCredits: true,
            },
          },
          _count: {
            select: {
              messagesSent: {
                where: {
                  created_at: {
                    gt: firstDay,
                    lte: lastDayCurrentMonth,
                  },
                },
              },
            },
          },
        },
      });

      if (!user) throw new BadRequestException(AuthErrors.AccountNotFound);

      if (user.planPayment === 'PRE') {
        const userHasLimitTOSendMessages =
          user.balanceCredits >= createMessageDto.phoneNumbers.length;

        if (!userHasLimitTOSendMessages) {
          throw new BadRequestException(
            CommonErrors.UserDontHaveLimitToSendMessage,
          );
        }

        await transaction.message.createMany({
          data: createMessageDto.phoneNumbers.map((phoneNumber) => ({
            isWhatsApp: createMessageDto.isWhatsApp,
            text: createMessageDto.text,
            phoneNumber,
            customerId: user.id,
          })),
        });

        await transaction.customer.update({
          where: {
            id: user.id,
          },
          data: {
            balanceCredits: {
              decrement: createMessageDto.phoneNumbers.length,
            },
          },
        });
        return;
      } else {
        const limitConsumptionPlan =
          (user._count.messagesSent ?? 0) +
          createMessageDto.phoneNumbers.length;

        if (limitConsumptionPlan > user.posPaidPlan.balanceCredits) {
          throw new BadRequestException(CommonErrors.LimitOfThePlanReached);
        }

        await transaction.message.createMany({
          data: createMessageDto.phoneNumbers.map((phoneNumber) => ({
            isWhatsApp: createMessageDto.isWhatsApp,
            text: createMessageDto.text,
            phoneNumber,
            customerId: user.id,
          })),
        });

        await transaction.customer.update({
          where: {
            id: user.id,
          },
          data: {
            consumptionPlan: {
              increment: createMessageDto.phoneNumbers.length,
            },
          },
        });
        return;
      }
    });
  }

  async findAll(
    user_id: string,
    { skip, take, orderBy, ...query }: MessagesQuery,
  ) {
    if (query?.search?.text) query.search.text.mode = 'insensitive';

    const where: Prisma.MessageWhereInput = {
      ...query.search,
      customerId: user_id,
    };

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.message.count({ where }),
      this.prisma.message.findMany({
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
}
