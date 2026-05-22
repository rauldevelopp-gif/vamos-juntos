const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const beaches = await prisma.beach.findMany();
    console.log("BEACHES:", JSON.stringify(beaches.map(b => ({id: b.id, name: b.name})), null, 2));

    const attractions = await prisma.attraction.findMany();
    console.log("ATTRACTIONS:", JSON.stringify(attractions.map(a => ({id: a.id, name: a.name})), null, 2));
}

main().finally(() => prisma.$disconnect());
