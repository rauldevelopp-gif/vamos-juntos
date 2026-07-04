import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pkgCount = await prisma.packageReservation.count();
  const resCount = await prisma.reservation.count();
  console.log('Package reservations count:', pkgCount);
  console.log('Custom reservations count:', resCount);
  
  const pkgResList = await prisma.packageReservation.findMany({ take: 5 });
  console.log('Sample Package Reservations:', pkgResList);
  
  const resList = await prisma.reservation.findMany({ take: 5 });
  console.log('Sample Reservations:', resList);
}

main().catch(console.error).finally(() => prisma.$disconnect());
