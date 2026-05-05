'use server';

import prisma from '@/lib/db';

export async function getAttractions() {
    try {
        let attractions = await prisma.attraction.findMany({
            orderBy: { name: 'asc' }
        });

        if (attractions.length === 0) {
            await seedInitialAttractions();
            attractions = await prisma.attraction.findMany({
                orderBy: { name: 'asc' }
            });
        }

        return { success: true, data: attractions };
    } catch (error) {
        console.error('Error fetching attractions:', error);
        return { success: false, error: 'No se pudieron cargar las atracciones' };
    }
}

async function seedInitialAttractions() {
    const attractionsData = [
        { name: 'Xcaret Park', category: 'Eco-Arqueológico', city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Abierto', coordinates: '20.5794,-87.1197', recommendedTime: '1 Día' },
        { name: 'Chichén Itzá', category: 'Arqueológico', city: 'Pisté', state: 'Yucatán', status: 'Abierto', coordinates: '20.6843,-88.5678', recommendedTime: '6 Horas' },
        { name: 'Museo Subacuático (MUSA)', category: 'Arte y Buceo', city: 'Cancún', state: 'Quintana Roo', status: 'Abierto', coordinates: '21.1215,-86.7516', recommendedTime: '3 Horas' },
    ];

    for (const attraction of attractionsData) {
        await prisma.attraction.create({
            data: attraction
        });
    }
}
