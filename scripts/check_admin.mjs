import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function checkAdmin() {
  const rows = await prisma.$queryRaw`SELECT id, username, password FROM "User" WHERE LOWER(username) = 'admin'`;
  console.log('Admin rows:', rows);
}

checkAdmin()
  .catch(e => console.error('Error:', e))
  .finally(() => prisma.$disconnect());
