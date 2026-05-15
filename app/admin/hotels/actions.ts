'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getHotels() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

        let hotels = await prisma.hotel.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });

        if (hotels.length === 0 && user.role === 'ADMIN') {
            await seedInitialHotels();
            hotels = await prisma.hotel.findMany({
                where: whereClause,
                orderBy: { name: 'asc' }
            });
        }

        return { success: true, data: hotels };
    } catch (error) {
        console.error('Error fetching hotels:', error);
        return { success: false, error: 'No se pudieron cargar los hoteles' };
    }
}

async function seedInitialHotels() {
    const user = await getCurrentUser();
    const hotelsData = [
        { name: 'Grand Fiesta Americana', location: 'Zona Hotelera Km 14.5', stars: 5, city: 'Cancún', state: 'Quintana Roo', status: 'Disponible', coordinates: '21.1276,-86.7617', userId: user?.id },
        { name: 'Nizuc Resort & Spa', location: 'Blvd. Kukulcan Km 21', stars: 5, city: 'Cancún', state: 'Quintana Roo', status: 'Disponible', coordinates: '21.0336,-86.7786', userId: user?.id },
        { name: 'Rosewood Mayakoba', location: 'Ctra. Fed. Cancún-Playa Km 298', stars: 5, city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Reservado', coordinates: '20.6778,-87.0319', userId: user?.id },
    ];

    for (const hotel of hotelsData) {
        await prisma.hotel.create({
            data: hotel
        });
    }
}
