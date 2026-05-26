'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// --- HOTELS ---

export async function getHotels() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

        const hotels = await prisma.hotel.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
            include: {
                rooms: true
            }
        });

        return { success: true, data: hotels };
    } catch (error) {
        console.error('Error fetching hotels:', error);
        return { success: false, error: 'No se pudieron cargar los hoteles' };
    }
}

export async function saveHotel(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const hotelData = {
            name: data.name,
            location: data.location || '',
            stars: parseInt(data.stars) || 5,
            city: data.city,
            state: data.state,
            status: data.status || 'Activo',
            coordinates: data.coordinates || '',
            description: data.description || '',
            category: data.category || 'Estándar',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            policies: data.policies || '',
            checkInTime: data.checkInTime || '15:00',
            checkOutTime: data.checkOutTime || '11:00',
            amenities: data.amenities || [],
            gallery: data.gallery || [],
        };

        let result;
        if (data.id) {
            // Validate owner
            const existing = await prisma.hotel.findUnique({ where: { id: data.id } });
            if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
                return { success: false, error: 'No autorizado o no existe' };
            }
            result = await prisma.hotel.update({
                where: { id: data.id },
                data: hotelData
            });
        } else {
            result = await prisma.hotel.create({
                data: {
                    ...hotelData,
                    userId: user.id
                }
            });
        }

        revalidatePath('/admin/hotels');
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error saving hotel:', error);
        return { success: false, error: error.message || 'Error al guardar el hotel' };
    }
}

export async function deleteHotel(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const existing = await prisma.hotel.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        // Delete associated rooms first
        await prisma.hotelRoom.deleteMany({
            where: { hotelId: id }
        });

        await prisma.hotel.delete({ where: { id } });
        revalidatePath('/admin/hotels');
        return { success: true };
    } catch (error) {
        console.error('Error deleting hotel:', error);
        return { success: false, error: 'Error al eliminar el hotel' };
    }
}

// --- HOTEL ROOMS ---

export async function getHotelRooms(hotelId: number) {
    try {
        const rooms = await prisma.hotelRoom.findMany({
            where: { hotelId },
            orderBy: { basePrice: 'asc' }
        });
        return { success: true, data: rooms };
    } catch (error) {
        return { success: false, error: 'Error fetching rooms' };
    }
}

export async function saveHotelRoom(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        // Verify hotel ownership
        const hotel = await prisma.hotel.findUnique({ where: { id: data.hotelId } });
        if (!hotel || (hotel.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado para este hotel' };
        }

        const roomData = {
            hotelId: data.hotelId,
            type: data.type,
            maxCapacity: parseInt(data.maxCapacity) || 2,
            quantity: parseInt(data.quantity) || 1,
            basePrice: parseFloat(data.basePrice) || 0,
            gallery: data.gallery || [],
            amenities: data.amenities || [],
            cancellationPolicy: data.cancellationPolicy || '',
            status: data.status || 'Activa'
        };

        let result;
        if (data.id) {
            result = await prisma.hotelRoom.update({
                where: { id: data.id },
                data: roomData
            });
        } else {
            result = await prisma.hotelRoom.create({
                data: roomData
            });
        }

        revalidatePath(`/admin/hotels/${data.hotelId}/rooms`);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || 'Error saving room' };
    }
}

export async function deleteHotelRoom(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const room = await prisma.hotelRoom.findUnique({ where: { id }, include: { hotel: true } });
        if (!room || (room.hotel.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        await prisma.hotelRoom.delete({ where: { id } });
        revalidatePath(`/admin/hotels/${room.hotelId}/rooms`);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Error deleting room' };
    }
}
