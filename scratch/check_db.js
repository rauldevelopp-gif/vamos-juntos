const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- USERS ---");
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true } });
    console.table(users);

    console.log("\n--- HOTELS ---");
    const hotels = await prisma.hotel.findMany({ select: { id: true, name: true, userId: true } });
    console.table(hotels);
    
    console.log("\n--- RESERVATIONS ---");
    const res = await prisma.reservation.findMany({ select: { id: true, locator: true, status: true } });
    console.table(res);

    console.log("\n--- DESTINATIONS (Airports/Zones) ---");
    const dests = await prisma.destination.findMany({ select: { id: true, name: true, type: true } });
    console.table(dests);
}

main().catch(console.error).finally(() => prisma.$disconnect());
