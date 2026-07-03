import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pkg = await prisma.package.findUnique({
    where: { id: 24 },
    include: { videos: true }
  });
  console.log('--- PACKAGE 24 DETAILS ---');
  console.log(JSON.stringify(pkg, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
