'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getBeaches() {
    try {
        const user = await getCurrentUser();
        
        const whereClause = (!user || user.role === 'ADMIN') ? {} : { userId: user.id };

        let beaches = await prisma.beach.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });

        if (beaches.length === 0 && (!user || user.role === 'ADMIN')) {
            await seedInitialBeaches();
            beaches = await prisma.beach.findMany({
                where: whereClause,
                orderBy: { name: 'asc' }
            });
        }

        return { success: true, data: beaches };
    } catch (error) {
        console.error('Error fetching beaches:', error);
        return { success: false, error: 'No se pudieron cargar las playas' };
    }
}

export async function createBeach(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        const newBeach = await prisma.beach.create({
            data: {
                ...data,
                userId: user.id
            }
        });
        return { success: true, data: newBeach };
    } catch (error) {
        return { success: false, error: 'Error al crear playa' };
    }
}

export async function updateBeach(id: number, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const existing = await prisma.beach.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        const updated = await prisma.beach.update({
            where: { id },
            data
        });
        return { success: true, data: updated };
    } catch (error) {
        return { success: false, error: 'Error al actualizar playa' };
    }
}

async function seedInitialBeaches() {
    const user = await getCurrentUser();
    const beachesData = [
        { name: 'Playa Delfines', location: 'Blvd. Kukulcan Km 18', city: 'Cancún', state: 'Quintana Roo', status: 'Abierta', coordinates: '21.0602,-86.7806', type: 'Pública', popularity: 'Alta', userId: user?.id },
        { name: 'Playa Norte', location: 'Extremo norte de la isla', city: 'Isla Mujeres', state: 'Quintana Roo', status: 'Abierta', coordinates: '21.2586,-86.7503', type: 'Turística', popularity: 'Muy Alta', userId: user?.id },
        { name: 'Playa Paraíso', location: 'Zona Arqueológica Tulum', city: 'Tulum', state: 'Quintana Roo', status: 'Abierta', coordinates: '20.2155,-87.4302', type: 'Parque', popularity: 'Alta', userId: user?.id },
    ];

    for (const beach of beachesData) {
        await prisma.beach.create({
            data: beach
        });
    }
}

export async function getPublicBeaches() {
    try {
        const beaches = await prisma.beach.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: beaches };
    } catch (error) {
        return { success: false, error: 'Error al obtener playas' };
    }
}
