'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getTaxis() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

        const taxis = await prisma.taxi.findMany({
            where: whereClause,
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
