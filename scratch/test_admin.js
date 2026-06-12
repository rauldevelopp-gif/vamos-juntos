const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userLogin = 'Admin';
    const user = await prisma.user.findFirst({
        where: { username: { equals: userLogin, mode: 'insensitive' } }
    });
    console.log("Found user:", user);

    if (!user) {
        console.log("No user found");
        return;
    }

    const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };
    console.log("Where clause:", whereClause);

    try {
        const hotels = await prisma.hotel.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
            include: { rooms: true }
        });
        console.log("Fetched hotels:", hotels.length);
    } catch (e) {
        console.error("Error fetching hotels:", e);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
