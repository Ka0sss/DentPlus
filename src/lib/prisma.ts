import { PrismaClient } from '../generated/prisma/client/index.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL || 'file:./prisma/dev.db'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter: new PrismaLibSql({ url: connectionString })
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
