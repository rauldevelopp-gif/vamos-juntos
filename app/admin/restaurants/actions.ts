'use server';

import prisma from '@/lib/db';

export async function getRestaurants() {
    try {
        let restaurants = await prisma.restaurant.findMany({
            orderBy: { name: 'asc' }
        });

        if (restaurants.length === 0) {
            await seedInitialRestaurants();
            restaurants = await prisma.restaurant.findMany({
                orderBy: { name: 'asc' }
            });
        }

        return { success: true, data: restaurants };
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return { success: false, error: 'No se pudieron cargar los restaurantes' };
    }
}

async function seedInitialRestaurants() {
    const restaurantsData = [
        { name: 'Puerto Madero', cuisine: 'Argentina / Cortes', city: 'Cancún', state: 'Quintana Roo', status: 'Abierto', coordinates: '21.1094,-86.7645', priceRange: '$$$$' },
        { name: 'Porfirio\'s', cuisine: 'Mexicana Contemporánea', city: 'Cancún', state: 'Quintana Roo', status: 'Abierto', coordinates: '21.1112,-86.7628', priceRange: '$$$' },
        { name: 'Harry\'s Steakhouse', cuisine: 'Fine Dining / Prime Steak', city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Abierto', coordinates: '20.6276,-87.0728', priceRange: '$$$$' },
    ];

    for (const restaurant of restaurantsData) {
        await prisma.restaurant.create({
            data: restaurant
        });
    }
}
