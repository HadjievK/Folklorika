import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}).$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        // Automatically disconnect after each operation in serverless
        try {
          return await query(args);
        } finally {
          if (process.env.VERCEL) {
            // In production/serverless, disconnect after operation
            setTimeout(() => {
              prisma.$disconnect();
            }, 1000);
          }
        }
      },
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
