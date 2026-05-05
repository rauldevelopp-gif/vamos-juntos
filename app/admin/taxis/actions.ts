'use server';

import prisma from '@/lib/db';

export async function getTaxis() {
    try {
        const taxis = await prisma.taxi.findMany({
            include: {
                driver: true
            },
            orderBy: { plate: 'asc' }
        });
        return { success: true, data: taxis };
    } catch (error) {
        console.error('Error fetching taxis:', error);
        return { success: false, error: 'No se pudieron cargar los taxis' };
    }
}
