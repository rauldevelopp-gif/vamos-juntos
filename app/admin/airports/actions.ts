'use server';

import prisma from '@/lib/db';

export async function getAirports() {
    try {
        let airports = await prisma.airport.findMany({
            orderBy: { name: 'asc' }
        });

        if (airports.length === 0) {
            await seedInitialAirports();
            airports = await prisma.airport.findMany({
                orderBy: { name: 'asc' }
            });
        }

        return { success: true, data: airports };
    } catch (error) {
        console.error('Error fetching airports:', error);
        return { success: false, error: 'No se pudieron cargar los aeropuertos' };
    }
}

async function seedInitialAirports() {
    const airportsData = [
        { name: 'Aeropuerto Int. de Cancún', location: 'Carretera Cancún-Chetumal Km 22', iata: 'CUN', city: 'Cancún', state: 'Quintana Roo', status: 'Operativo', coordinates: '21.0367,-86.8770' },
        { name: 'Aeropuerto de la Ciudad de México', location: 'Av. Capitán Carlos León s/n', iata: 'MEX', city: 'CDMX', state: 'CDMX', status: 'Operativo', coordinates: '19.4361,-99.0719' },
        { name: 'Aeropuerto de Tulum (Felipe Carrillo)', location: 'Ctra. Fed 307 Km 201', iata: 'TQO', city: 'Tulum', state: 'Quintana Roo', status: 'Nuevo', coordinates: '20.1558,-87.6698' },
    ];

    for (const airport of airportsData) {
        await prisma.airport.create({
            data: airport
        });
    }
}

export async function deleteAirport(id: number) {
    try {
        await prisma.airport.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error('Error deleting airport:', error);
        return { success: false, error: 'No se pudo eliminar el aeropuerto' };
    }
}
