'use server';

import prisma from '@/lib/db';

export async function getPackages() {
    try {
        let packages = await prisma.package.findMany({
            where: { clientId: null },
            include: {
                driver: {
                    include: {
                        taxis: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (packages.length < 8) {
            await seedPremiumPackages();
            packages = await prisma.package.findMany({
                where: { clientId: null },
                include: {
                    driver: {
                        include: {
                            taxis: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }

        return { success: true, data: packages };
    } catch (error) {
        console.error('Error fetching packages:', error);
        return { success: false, error: 'No se pudieron cargar los paquetes' };
    }
}

export async function createPackage(data: {
    name: string;
    description: string;
    total: number;
    clientId?: string;
    date?: string;
    image: string | null;
    startTime?: string;
    items: unknown;
    driverId?: number;
}) {
    try {
        console.log('Attempting to create package with data:', JSON.stringify(data, null, 2));
        const newPackage = await prisma.package.create({
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.total) || 0,
                status: data.clientId ? 'Pendiente' : 'Activo',
                date: data.date || new Date().toISOString().split('T')[0], // Use provided date or today
                image: data.image,
                start_time: data.startTime || "08:00",
                items: data.items, // JSON
                driverId: data.driverId ? Number(data.driverId) : null,
                clientId: data.clientId || null,
                sales: 0
            }
        });
        return { success: true, data: newPackage };
    } catch (error: unknown) {
        console.error('Error creating package:', error);
        const message = error instanceof Error ? error.message : 'Error desconocido';
        return { success: false, error: 'Error al guardar el paquete: ' + message };
    }
}

export async function getClientRequests() {
    try {
        const requests = await prisma.package.findMany({
            where: { NOT: { clientId: null } },
            include: {
                driver: {
                    include: {
                        taxis: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: requests };
    } catch (error) {
        console.error('Error fetching client requests:', error);
        return { success: false, error: 'Error al cargar las solicitudes' };
    }
}

export async function getPackagesByClientId(clientId: string) {
    try {
        const packages = await prisma.package.findMany({
            where: { clientId },
            include: {
                driver: {
                    include: {
                        taxis: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: packages };
    } catch (error) {
        console.error('Error fetching client packages:', error);
        return { success: false, error: 'Error al cargar tus solicitudes' };
    }
}

export async function confirmPackage(id: number, driverId: number) {
    try {
        const updated = await prisma.package.update({
            where: { id },
            data: {
                status: 'Confirmado',
                driverId: driverId
            }
        });
        return { success: true, data: updated };
    } catch (error: unknown) {
        console.error('Error creating package:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
    }
}

export async function seedPremiumPackages() {
    try {
        const drivers = await prisma.driver.findMany({ take: 3 });
        const dId = drivers[0]?.id || null;

        const packagesData = [
            {
                name: 'Caribe VIP: Yates & Gastronomía',
                description: 'Una experiencia inigualable que combina la libertad de navegar en un yate privado con una cena gourmet de 5 tiempos preparada por un chef personal a bordo.',
                price: 2850,
                status: 'Activo',
                date: '2024-07-15',
                image: '/yacht_luxury_gastronomy_1778014471617.png',
                start_time: '09:00',
                driverId: dId,
                sales: 12,
                items: [
                    { id: '1', type: 'aeropuerto', name: 'Traslado VIP (Suburban)', price: 150 },
                    { id: '2', type: 'yate', name: 'Yate Azimut 50ft Luxury', price: 1500 },
                    { id: '3', type: 'restaurante', name: 'Cena de Autor a Bordo', price: 850 },
                    { id: '4', type: 'playa', name: 'Club de Playa Exclusivo', price: 350 }
                ]
            },
            {
                name: 'Aventura Total en Isla Mujeres',
                description: 'Explora los rincones más bellos de Isla Mujeres con un itinerario que incluye snorkel en arrecifes vírgenes y estancia en un resort de clase mundial.',
                price: 1950,
                status: 'Activo',
                date: '2024-08-10',
                image: '/isla_mujeres_adventure_1778014484244.png',
                driverId: dId,
                sales: 8,
                items: [
                    { id: '1', type: 'yate', name: 'Catamarán Privado 40ft', price: 900 },
                    { id: '2', type: 'playa', name: 'Tour Arrecife El Meco', price: 250 },
                    { id: '3', type: 'hotel', name: 'Stay en Mia Reef Resort', price: 600 },
                    { id: '4', type: 'restaurante', name: 'Almuerzo en Marbella Fish Market', price: 200 }
                ]
            },
            {
                name: 'Cena Romántica & Refugio de Lujo',
                description: 'Diseñado para parejas que buscan exclusividad. Incluye una noche en una suite premium y una cena privada bajo las estrellas.',
                price: 1450,
                status: 'Activo',
                date: '2024-06-20',
                image: '/romantic_dinner_resort_1778014501603.png',
                driverId: dId,
                sales: 24,
                items: [
                    { id: '1', type: 'hotel', name: 'Suite con Vista al Mar - Nizuc', price: 800 },
                    { id: '2', type: 'restaurante', name: 'Cena Privada en Muelle', price: 450 },
                    { id: '3', type: 'aeropuerto', name: 'Traslado de Lujo (Tesla)', price: 120 },
                    { id: '4', type: 'atraccion', name: 'Sesión de Fotos al Atardecer', price: 80 }
                ]
            },
            {
                name: 'Exploración de Playas Escondidas',
                description: 'Un viaje a las joyas ocultas de la Riviera Maya. Visita playas vírgenes lejos del turismo masivo con todo el confort incluido.',
                price: 980,
                status: 'Activo',
                date: '2024-09-05',
                image: '/hidden_beach_exploration_1778014515971.png',
                driverId: dId,
                sales: 15,
                items: [
                    { id: '1', type: 'aeropuerto', name: 'Transporte Privado Todo el Día', price: 300 },
                    { id: '2', type: 'playa', name: 'Acceso a Xpu-Ha Secreta', price: 180 },
                    { id: '3', type: 'atraccion', name: 'Guía de Naturaleza Privado', price: 250 },
                    { id: '4', type: 'restaurante', name: 'Picnic Gourmet en la Selva', price: 250 }
                ]
            },
            {
                name: 'Gourmet & Sunset Cruise',
                description: 'Disfruta de la mejor gastronomía del Caribe mientras el sol se oculta en el horizonte desde la comodidad de una embarcación privada.',
                price: 1750,
                status: 'Activo',
                date: '2024-10-12',
                image: '/gourmet_sunset_cruise_1778014528974.png',
                driverId: dId,
                sales: 32,
                items: [
                    { id: '1', type: 'yate', name: 'Lancha de Lujo 32ft', price: 700 },
                    { id: '2', type: 'restaurante', name: 'Degustación de Mariscos Premium', price: 650 },
                    { id: '3', type: 'atraccion', name: 'Música en Vivo (Saxofonista)', price: 300 },
                    { id: '4', type: 'aeropuerto', name: 'Retorno VIP al Hotel', price: 100 }
                ]
            }
        ];

        for (const pkg of packagesData) {
            await prisma.package.create({ data: pkg });
        }
        return { success: true };
    } catch (error) {
        console.error('Error seeding premium packages:', error);
        return { success: false, error: 'Error al cargar paquetes premium' };
    }
}

// seedInitialPackages removed
