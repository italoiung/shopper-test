import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const customerData: Prisma.CustomerCreateInput[] = [
  {
    measures: {
      create: [
        {
          image: 'example.jpeg',
          measuredAt: new Date(Date.now()),
          value: 13590,
          type: {
            connectOrCreate: {
              create: { id: 'GAS' },
              where: { id: 'GAS' },
            },
          },
        },
        {
          image: 'example.jpeg',
          measuredAt: new Date(Date.now()),
          value: 13590,
          type: {
            connectOrCreate: {
              create: { id: 'WATER' },
              where: { id: 'WATER' },
            },
          },
        },
      ],
    },
  },
];

const main = async () => {
  console.log(`Start seeding ...`);

  for (const data of customerData) {
    const customer = await prisma.customer.create({
      data,
    });

    console.log(`Created customer with id: ${customer.id}`);
  }
  console.log(`Seeding finished.`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
