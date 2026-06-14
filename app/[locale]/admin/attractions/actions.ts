'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getAttractions() {
    try {
        const user = await getCurrentUser();
        
        const whereClause = (!user || user.role === 'ADMIN') ? {} : { userId: user.id };

        let attractions = await prisma.attraction.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });

        if (attractions.length === 0 && (!user || user.role === 'ADMIN')) {
            await seedInitialAttractions();
            attractions = await prisma.attraction.findMany({
                where: whereClause,
                orderBy: { name: 'asc' }
            });
        }

        return { success: true, data: attractions };
    } catch (error) {
        console.error('Error fetching attractions:', error);
        return { success: false, error: 'No se pudieron cargar las atracciones' };
    }
}

export async function createAttraction(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        const newAttraction = await prisma.attraction.create({
            data: {
                ...data,
                userId: user.id
            }
        });
        return { success: true, data: newAttraction };
    } catch (error) {
        console.error("Error creating attraction:", error);
        return { success: false, error: 'Error al crear atracción' };
    }
}

export async function bulkCreateAttractions(dataArray: any[]) {
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
            const category = findVal(item, ['category', 'categoría', 'categoria']) || 'General';
            const city = findVal(item, ['city', 'ciudad']) || 'Desconocido';
            const state = findVal(item, ['state', 'estado', 'provincia']) || 'Desconocido';
            const status = findVal(item, ['status', 'estado operativo', 'estatus']) || 'Abierto';
            const coordinates = findVal(item, ['coordinates', 'coordenadas']) || '';
            const recommendedTime = findVal(item, ['recommendedtime', 'tiempo recomendado']) || '2 Horas';
            const description_long = findVal(item, ['description_long', 'descripción', 'descripcion']) || '';
            const price = parseFloat(findVal(item, ['price', 'precio', 'precio base'])) || 0;

            return {
                name,
                category,
                city,
                state,
                status,
                coordinates,
                recommendedTime,
                description_long,
                price,
                userId: user.id
            };
        });

        const result = await prisma.attraction.createMany({
            data: formattedData,
            skipDuplicates: true
        });

        return { success: true, count: result.count };
    } catch (error) {
        console.error("Error in bulk create:", error);
        return { success: false, error: 'Error al importar datos' };
    }
}

export async function updateAttraction(id: number, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const existing = await prisma.attraction.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        const updated = await prisma.attraction.update({
            where: { id },
            data
        });
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error updating attraction:", error);
        console.error("Error updating attraction:", error);
        return { success: false, error: 'Error al actualizar atracción' };
    }
}

export async function deleteAttraction(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const existing = await prisma.attraction.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        await prisma.attraction.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting attraction:", error);
        return { success: false, error: 'Error al eliminar atracción' };
    }
}

async function seedInitialAttractions() {
    const user = await getCurrentUser();
    const attractionsData = [
        { name: 'Xcaret Park', category: 'Eco-Arqueológico', city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Abierto', coordinates: '20.5794,-87.1197', recommendedTime: '1 Día', userId: user?.id },
        { name: 'Chichén Itzá', category: 'Arqueológico', city: 'Pisté', state: 'Yucatán', status: 'Abierto', coordinates: '20.6843,-88.5678', recommendedTime: '6 Horas', userId: user?.id },
        { name: 'Museo Subacuático (MUSA)', category: 'Arte y Buceo', city: 'Cancún', state: 'Quintana Roo', status: 'Abierto', coordinates: '21.1215,-86.7516', recommendedTime: '3 Horas', userId: user?.id },
    ];

    for (const attraction of attractionsData) {
        await prisma.attraction.create({
            data: attraction
        });
    }
}

export async function getPublicAttractions() {
    try {
        const attractions = await prisma.attraction.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: attractions };
    } catch (error) {
        return { success: false, error: 'Error al obtener atracciones' };
    }
}
