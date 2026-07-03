import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  console.log('Testing saving a video associated to a package...');
  try {
    const pkg = await prisma.package.create({
      data: {
        name: 'Test Package with Videos',
        description: 'This is a test package description.',
        price: 999,
        date: '2026-07-02',
        status: 'Borrador',
        image: '/mexico_luxury_ruins_hero_1778020263723.png',
        videos: {
          create: [
            {
              title: 'Test Promo Video 1',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
              order: 0
            }
          ]
        }
      },
      include: {
        videos: true
      }
    });
    console.log('Package created successfully with videos:', JSON.stringify(pkg, null, 2));
  } catch (error) {
    console.error('Error saving package and video:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
