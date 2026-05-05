'use server';

import prisma from '@/lib/db';

export async function getBeaches() {
    try {
        let beaches = await prisma.beach.findMany({
            orderBy: { name: 'asc' }
        });

        if (beaches.length === 0) {
            await seedInitialBeaches();
            beaches = await prisma.beach.findMany({
                orderBy: { name: 'asc' }
            });
        }

        return { success: true, data: beaches };
    } catch (error) {
        console.error('Error fetching beaches:', error);
        return { success: false, error: 'No se pudieron cargar las playas' };
    }
}

async function seedInitialBeaches() {
    const beachesData = [
        { name: 'Playa Delfines', location: 'Blvd. Kukulcan Km 18', city: 'Cancún', state: 'Quintana Roo', status: 'Abierta', coordinates: '21.0602,-86.7806', type: 'Pública', popularity: 'Alta' },
        { name: 'Playa Norte', location: 'Extremo norte de la isla', city: 'Isla Mujeres', state: 'Quintana Roo', status: 'Abierta', coordinates: '21.2586,-86.7503', type: 'Turística', popularity: 'Muy Alta' },
        { name: 'Playa Paraíso', location: 'Zona Arqueológica Tulum', city: 'Tulum', state: 'Quintana Roo', status: 'Abierta', coordinates: '20.2155,-87.4302', type: 'Parque', popularity: 'Alta' },
    ];

    for (const beach of beachesData) {
        await prisma.beach.create({
            data: beach
        });
    }
}
