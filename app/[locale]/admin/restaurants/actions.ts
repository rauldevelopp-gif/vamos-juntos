'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getRestaurants() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

        let restaurants = await prisma.restaurant.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });

        if (restaurants.length === 0 && user.role === 'ADMIN') {
            await seedInitialRestaurants();
            restaurants = await prisma.restaurant.findMany({
                where: whereClause,
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
    const user = await getCurrentUser();
    const restaurantsData = [
        { name: 'Puerto Madero', cuisine: 'Argentina / Cortes', city: 'Cancún', state: 'Quintana Roo', status: 'Abierto', coordinates: '21.1094,-86.7645', priceRange: '$$$$', userId: user?.id },
        { name: 'Porfirio\'s', cuisine: 'Mexicana Contemporánea', city: 'Cancún', state: 'Quintana Roo', status: 'Abierto', coordinates: '21.1112,-86.7628', priceRange: '$$$', userId: user?.id },
        { name: 'Harry\'s Steakhouse', cuisine: 'Fine Dining / Prime Steak', city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Abierto', coordinates: '20.6276,-87.0728', priceRange: '$$$$', userId: user?.id },
    ];

    for (const restaurant of restaurantsData) {
        await prisma.restaurant.create({
            data: restaurant
        });
    }
}
