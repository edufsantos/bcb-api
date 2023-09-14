import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password_common = 'Senh@123';
  const bcryptSalt = await bcrypt.genSalt();
  const encrypted_password = await bcrypt.hash(password_common, bcryptSalt);

  await prisma.user.upsert({
    where: { email: 'eduardo@gmail.com' },
    update: {},
    create: {
      email: 'eduardo@gmail.com',
      name: 'Eduardo F. Santos',
      phoneNumber: '+55 (67) 993529521',
      cpf: '123456789',
      password: encrypted_password,
      emailVerified: true,
    },
  });

  await prisma.customer.upsert({
    where: { email: 'dev@gmail.com' },
    update: {},
    create: {
      email: 'customer@gmail.com',
      name: 'Customer F. Santos',
      phoneNumber: '+55 (67) 993529521',
      cpf: '123456789',
      cnpj: '123456789',
      companyName: 'My Company',
      password: encrypted_password,
      active: true,
      posPaidPlan: {
        create: {
          title: 'Pró',
          description: 'Pró Plan',
          price: 99.99,
          balanceCredits: 50.0,
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
