import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const taxis = await prisma.taxi.findMany({
      where: { status: 'Disponible' },
      select: { brand: true, model: true, plate: true }
    });

    const yachts = await prisma.yacht.findMany({
      where: { status: 'Disponible' },
      select: { name: true, brand: true, model: true }
    });

    console.log('--- AVAILABLE TAXIS ---');
    console.log(taxis);
    console.log('--- AVAILABLE YACHTS ---');
    console.log(yachts);
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
