'use server';

import { revalidatePath } from 'next/cache';

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

        return { success: true, data: beaches };
    } catch (error) {
        console.error('Error fetching beaches:', error);
        return { success: false, error: 'No se pudieron cargar las playas' };
    }
}

export async function getPublicBeaches() {
    try {
        let beaches = await prisma.beach.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: beaches };
    } catch (error) {
        console.error('Error fetching public beaches:', error);
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
        revalidatePath('/admin', 'layout');
        return { success: true, data: newBeach };
    } catch (error) {
        console.error("Error creating beach:", error);
        return { success: false, error: 'Error al crear la playa' };
    }
}

export async function bulkCreateBeaches(dataArray: any[]) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        // Helper function to find a key regardless of case
        const findVal = (obj: any, keys: string[]) => {
            const entry = Object.entries(obj).find(([k]) => keys.includes(k.toLowerCase().trim()));
            return entry ? entry[1] : undefined;
        };

        const formattedData = dataArray.map(item => {
            const name = findVal(item, ['name', 'nombre']) || 'Sin nombre';
            const type = findVal(item, ['type', 'tipo', 'categoría', 'categoria']) || 'Pública';
            const city = findVal(item, ['city', 'ciudad']) || 'Desconocido';
            const state = findVal(item, ['state', 'estado', 'provincia']) || 'Desconocido';
            const status = findVal(item, ['status', 'estado', 'estatus']) || 'Abierta';
            const coordinates = findVal(item, ['coordinates', 'coordenadas']) || '';
            const popularity = findVal(item, ['popularity', 'popularidad']) || 'Media';
            const description_long = findVal(item, ['description_long', 'descripción', 'descripcion']) || '';

            return {
                name,
                type,
                city,
                state,
                status,
                coordinates,
                popularity,
                description_long,
                userId: user.id
            };
        });

        const result = await prisma.beach.createMany({
            data: formattedData,
            skipDuplicates: true
        });

        return { success: true, count: result.count };
    } catch (error) {
        console.error("Error in bulk create beaches:", error);
        return { success: false, error: 'Error al importar datos' };
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
        revalidatePath('/admin', 'layout');
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error updating beach:", error);
        return { success: false, error: 'Error al actualizar la playa' };
    }
}

export async function deleteBeach(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const existing = await prisma.beach.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        await prisma.beach.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting beach:", error);
        return { success: false, error: 'Error al eliminar la playa' };
    }
}
