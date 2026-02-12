import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Validates that the Prisma client is correctly initialized with expected models.
 * Returns null if valid, or a NextResponse if invalid.
 */
export function validatePrismaModel(modelName: string) {
  if (!(prisma as any)[modelName]) {
    console.error(`Prisma model '${modelName}' is missing. Client might be stale or not generated.`);
    return true; // Returns true if it's MISSING
  }
  return false;
}
