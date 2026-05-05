const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TOP_BEACHES = [
    { name: 'Playa Norte', type: 'Pública / Club', city: 'Isla Mujeres', state: 'Quintana Roo', status: 'Abierta', popularity: 'Alta', coordinates: '21.2581,-86.7511' },
    { name: 'Playa Balandra', type: 'Reserva Natural', city: 'La Paz', state: 'Baja California Sur', status: 'Acceso Restringido', popularity: 'Alta', coordinates: '24.3211,-110.3211' },
    { name: 'Playa del Amor', type: 'Pública (Acceso por mar)', city: 'Cabo San Lucas', state: 'BCS', status: 'Abierta', popularity: 'Muy Alta', coordinates: '22.8741,-109.9041' },
    { name: 'Playa Akumal', type: 'Santuario de Tortugas', city: 'Akumal', state: 'Quintana Roo', status: 'Abierta', popularity: 'Alta', coordinates: '20.4041,-87.3141' },
    { name: 'Playa Delfines', type: 'Pública (Mirador)', city: 'Cancún', state: 'Quintana Roo', status: 'Abierta', popularity: 'Muy Alta', coordinates: '21.0541,-86.7841' },
    { name: 'Playa Maroma', type: 'Club de Playa Privado', city: 'Riviera Maya', state: 'Quintana Roo', status: 'Abierta', popularity: 'Media-Alta', coordinates: '20.7341,-86.9641' },
    { name: 'Playa Carrizalillo', type: 'Pública (Bahía)', city: 'Puerto Escondido', state: 'Oaxaca', status: 'Abierta', popularity: 'Media', coordinates: '15.8641,-97.0741' },
    { name: 'Playa Sayulita', type: 'Surf / Pública', city: 'Sayulita', state: 'Nayarit', status: 'Abierta', popularity: 'Alta', coordinates: '20.8641,-105.4441' },
    { name: 'Playa Paraíso', type: 'Pública (Ruinas)', city: 'Tulum', state: 'Quintana Roo', status: 'Abierta', popularity: 'Muy Alta', coordinates: '20.2141,-87.4341' },
];

async function main() {
    console.log('Seeding beaches...');
    for (const beach of TOP_BEACHES) {
        await prisma.beach.create({
            data: beach,
        });
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
