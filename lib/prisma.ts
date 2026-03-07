import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from './generated/prisma/client';

// Configure WebSocket for Neon Serverless Driver in Node environment
neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
  // Extract database URL from process environment
  const connectionString = `${process.env.DATABASE_URL}`;

  // Initialize PrismaNeon adapter with the config directly
  const adapter = new PrismaNeon({ connectionString });

  // Pass it as the single required `adapter` option
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
