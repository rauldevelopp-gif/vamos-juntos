const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.user.updateMany({
        where: { email: 'admin@backstone.com' },
        data: { role: 'ADMIN' }
    });
    console.log("Updated admin@backstone.com role to ADMIN");
}
main().catch(console.error).finally(() => prisma.$disconnect());
