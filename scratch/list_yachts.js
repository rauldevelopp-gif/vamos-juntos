const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.yacht.findMany().then(res => console.log(JSON.stringify(res.map(y => ({id: y.id, name: y.name, brand: y.brand})), null, 2))).finally(() => prisma.$disconnect());
