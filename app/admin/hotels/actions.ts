'use server';

import prisma from '@/lib/db';

export async function getHotels() {
    try {
        let hotels = await prisma.hotel.findMany({
            orderBy: { name: 'asc' }
        });

        if (hotels.length === 0) {
            await seedInitialHotels();
            hotels = await prisma.hotel.findMany({
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
    const hotelsData = [
        { name: 'Grand Fiesta Americana', location: 'Zona Hotelera Km 14.5', stars: 5, city: 'Cancún', state: 'Quintana Roo', status: 'Disponible', coordinates: '21.1276,-86.7617' },
        { name: 'Nizuc Resort & Spa', location: 'Blvd. Kukulcan Km 21', stars: 5, city: 'Cancún', state: 'Quintana Roo', status: 'Disponible', coordinates: '21.0336,-86.7786' },
        { name: 'Rosewood Mayakoba', location: 'Ctra. Fed. Cancún-Playa Km 298', stars: 5, city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Reservado', coordinates: '20.6778,-87.0319' },
    ];

    for (const hotel of hotelsData) {
        await prisma.hotel.create({
            data: hotel
        });
    }
}
