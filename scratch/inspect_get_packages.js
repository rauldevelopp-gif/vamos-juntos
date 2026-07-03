import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany({
    where: { clientId: null },
    include: { 
        user: { select: { id: true, name: true, email: true, role: true } }, 
        driver: { include: { taxis: true } },
        videos: { orderBy: { order: 'asc' } }
    },
    orderBy: { createdAt: 'desc' }
  });
  console.log('--- PACKAGES RETRIEVED BY GETPACKAGES QUERY ---');
  packages.forEach(p => {
    console.log(`ID: ${p.id} | Name: ${p.name} | Videos count: ${p.videos.length}`);
    if (p.videos.length > 0) {
      console.log('Videos:', p.videos);
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
