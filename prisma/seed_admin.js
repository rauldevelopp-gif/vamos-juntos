const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Admin user...');

    // Hash password for Admin
    const adminPassword = crypto.createHash('sha256').update('@dmin').digest('hex');

    // Admin User
    await prisma.user.upsert({
        where: { username: 'Admin' },
        update: { password: adminPassword },
        create: {
            username: 'Admin',
            password: adminPassword,
            role: 'ADMIN',
            name: 'System Administrator'
        }
    });

    console.log('Admin user seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
