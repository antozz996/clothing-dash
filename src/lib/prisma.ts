import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  const db = new Database(dbPath)
  
  // Con Prisma 7, l'adapter BetterSqlite3 richiede l'istanza del DB
  const adapter = new PrismaBetterSqlite3(db)
  
  return new PrismaClient({ 
    adapter,
    // Aggiungiamo il logging in dev per il debug
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
