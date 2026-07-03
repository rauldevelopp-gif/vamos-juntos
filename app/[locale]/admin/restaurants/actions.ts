'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getRestaurants() {
    try {
        const user = await getCurrentUser();
        const whereClause = (!user || user.role === 'ADMIN') ? {} : { userId: user.id };

        let restaurants = await prisma.restaurant.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });

        return { success: true, data: restaurants };
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return { success: false, error: 'No se pudieron cargar los restaurantes' };
    }
}

export async function getPublicRestaurants() {
    try {
        let restaurants = await prisma.restaurant.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: restaurants };
    } catch (error) {
        console.error('Error fetching public restaurants:', error);
        return { success: false, error: 'No se pudieron cargar los restaurantes' };
    }
}

export async function createRestaurant(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const newRestaurant = await prisma.restaurant.create({
            data: {
                ...data,
                userId: user.id
            }
        });
        return { success: true, data: newRestaurant };
    } catch (error) {
        console.error("Error creating restaurant:", error);
        return { success: false, error: 'Error al crear el restaurante' };
    }
}

export async function bulkCreateRestaurants(dataArray: any[]) {
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
            const cuisine = findVal(item, ['cuisine', 'cocina', 'tipo', 'categoría', 'categoria']) || 'General';
            const city = findVal(item, ['city', 'ciudad']) || 'Desconocido';
            const state = findVal(item, ['state', 'estado', 'provincia']) || 'Desconocido';
            const status = findVal(item, ['status', 'estado operativo', 'estatus']) || 'Abierto';
            const coordinates = findVal(item, ['coordinates', 'coordenadas']) || '';
            const priceRange = findVal(item, ['pricerange', 'precio', 'rango de precio']) || '$$';

            return {
                name,
                cuisine,
                city,
                state,
                status,
                coordinates,
                priceRange,
                userId: user.id
            };
        });

        const result = await prisma.restaurant.createMany({
            data: formattedData,
            skipDuplicates: true
        });

        return { success: true, count: result.count };
    } catch (error) {
        console.error("Error in bulk create restaurants:", error);
        return { success: false, error: 'Error al importar datos' };
    }
}

export async function updateRestaurant(id: number, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const existing = await prisma.restaurant.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        const updated = await prisma.restaurant.update({
            where: { id },
            data
        });
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error updating restaurant:", error);
        return { success: false, error: 'Error al actualizar el restaurante' };
    }
}

export async function deleteRestaurant(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const existing = await prisma.restaurant.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        await prisma.restaurant.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        return { success: false, error: 'Error al eliminar el restaurante' };
    }
}
