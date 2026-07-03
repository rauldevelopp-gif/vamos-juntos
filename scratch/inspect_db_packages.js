import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany({
    include: { videos: true }
  });
  console.log('--- PACKAGES IN DATABASE ---');
  packages.forEach(pkg => {
    console.log(`ID: ${pkg.id} | Name: ${pkg.name} | Videos Count: ${pkg.videos.length}`);
    if (pkg.videos.length > 0) {
      console.log('Videos:', pkg.videos);
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
