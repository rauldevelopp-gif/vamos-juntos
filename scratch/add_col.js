const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Adding language column...");
    await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "language" TEXT NOT NULL DEFAULT \'es\';');
    console.log("Added language column successfully.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
