const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const attractions = await prisma.attraction.findMany();
    for (const attr of attractions) {
        // Use a unique seed for each attraction name so it's consistent
        const seed = encodeURIComponent(attr.name.replace(/\s+/g, '').toLowerCase());
        const url = `https://picsum.photos/seed/${seed}/800/600`;
        await prisma.attraction.update({
            where: { id: attr.id },
            data: { gallery: [url] }
        });
        console.log(`Updated attraction image: ${attr.name} to ${url}`);
    }

    const beaches = await prisma.beach.findMany();
    for (const beach of beaches) {
        // Only update Sayulita and Paraiso which were the broken ones (the rest are local pngs)
        if (beach.name === 'Playa Sayulita' || beach.name === 'Playa Paraíso') {
            const seed = encodeURIComponent(beach.name.replace(/\s+/g, '').toLowerCase());
            const url = `https://picsum.photos/seed/${seed}/800/600`;
            await prisma.beach.update({
                where: { id: beach.id },
                data: { gallery: [url] }
            });
            console.log(`Updated beach image: ${beach.name} to ${url}`);
        }
    }
}

main().finally(() => prisma.$disconnect());
