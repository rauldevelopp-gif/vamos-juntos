'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getAirports() {
    try {
        const user = await getCurrentUser();
        const whereClause = (!user || user.role === 'ADMIN') ? {} : { userId: user.id };

        let airports = await prisma.airport.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });

        return { success: true, data: airports };
    } catch (error) {
        console.error('Error fetching airports:', error);
        return { success: false, error: 'No se pudieron cargar los aeropuertos' };
    }
}

export async function createAirport(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const iata = (data.iata || '').toUpperCase();
        
        const newAirport = await prisma.airport.create({
            data: {
                ...data,
                iata,
                userId: user.id
            }
        });
        return { success: true, data: newAirport };
    } catch (error: any) {
        console.error("Error creating airport:", error);
        if (error.code === 'P2002') {
            return { success: false, error: 'Ya existe un aeropuerto con ese código IATA' };
        }
        return { success: false, error: 'Error al crear aeropuerto' };
    }
}

export async function bulkCreateAirports(dataArray: any[]) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        // Helper function to find a key regardless of case
        const findVal = (obj: any, keys: string[]) => {
            const entry = Object.entries(obj).find(([k]) => keys.includes(k.toLowerCase().trim()));
            return entry ? entry[1] : undefined;
        };

        const formattedData = dataArray.map((item, index) => {
            const name = findVal(item, ['name', 'nombre']) || 'Sin nombre';
            const location = findVal(item, ['location', 'ubicación', 'ubicacion', 'direccion']) || 'Desconocido';
            let iata = (findVal(item, ['iata', 'código iata', 'codigo iata']) || '').toString().toUpperCase().trim();
            // Fallback for empty IATA so it doesn't collide
            if (!iata) iata = `XX${index}${Math.floor(Math.random() * 100)}`;
            
            const city = findVal(item, ['city', 'ciudad']) || 'Desconocido';
            const state = findVal(item, ['state', 'estado', 'provincia']) || 'Desconocido';
            const status = findVal(item, ['status', 'estado operativo', 'estatus']) || 'Operativo';
            const coordinates = findVal(item, ['coordinates', 'coordenadas']) || '';

            return {
                name,
                location,
                iata,
                city,
                state,
                status,
                coordinates,
                userId: user.id
            };
        });

        const result = await prisma.airport.createMany({
            data: formattedData,
            skipDuplicates: true
        });

        return { success: true, count: result.count };
    } catch (error) {
        console.error("Error in bulk create airports:", error);
        return { success: false, error: 'Error al importar datos' };
    }
}

export async function updateAirport(id: number, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const existing = await prisma.airport.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        const iata = (data.iata || '').toUpperCase();

        const updated = await prisma.airport.update({
            where: { id },
            data: {
                ...data,
                iata
            }
        });
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error updating airport:", error);
        if (error.code === 'P2002') {
            return { success: false, error: 'Ya existe un aeropuerto con ese código IATA' };
        }
        return { success: false, error: 'Error al actualizar aeropuerto' };
    }
}

export async function deleteAirport(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const existing = await prisma.airport.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        await prisma.airport.delete({
            where: { id }
        });
        revalidatePath('/admin', 'layout');
        return { success: true };
    } catch (error) {
        console.error("Error deleting airport:", error);
        return { success: false, error: 'Error al eliminar aeropuerto' };
    }
}
