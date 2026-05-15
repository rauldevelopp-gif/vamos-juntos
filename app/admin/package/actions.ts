'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getPackages() {
    try {
        const user = await getCurrentUser();
        
        const baseWhere = { clientId: null };
        const whereClause = (!user || user.role === 'ADMIN') ? baseWhere : { ...baseWhere, userId: user.id };

        let packages = await prisma.package.findMany({
            where: whereClause,
            include: { user: { select: { id: true, name: true, email: true, role: true } }, driver: { include: { taxis: true } } },
            orderBy: { createdAt: 'desc' }
        });

        if (packages.length < 8 && user?.role === 'ADMIN') {
            await seedPremiumPackages();
            packages = await prisma.package.findMany({
                where: whereClause,
                include: { user: { select: { id: true, name: true, email: true, role: true } }, driver: { include: { taxis: true } } },
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
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

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
                sales: 0,
                userId: user.id
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
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const baseWhere = { NOT: { clientId: null } };
        const whereClause = user.role === 'ADMIN' ? baseWhere : { ...baseWhere, userId: user.id };

        const requests = await prisma.package.findMany({
            where: whereClause,
            include: { user: { select: { id: true, name: true, email: true, role: true } }, driver: { include: { taxis: true } } },
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
            include: { user: { select: { id: true, name: true, email: true, role: true } }, driver: { include: { taxis: true } } },
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
        const user = await getCurrentUser();
        const drivers = await prisma.driver.findMany({ take: 3 });
        const dId = drivers[0]?.id || null;

        const packagesData = [
            {
                name: 'Caribe VIP: Yates & Gastronomía',
                userId: user?.id,
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
                userId: user?.id,
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
                userId: user?.id,
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
                userId: user?.id,
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
                userId: user?.id,
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

export async function createPackageReservation(data: {
    packageId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCountry: string;
    date: string;
    time: string;
    passengers: number;
    basePrice: number;
    serviceFee: number;
    totalPrice: number;
    notes: string;
}) {
    try {
        const pkg = await prisma.package.findUnique({ where: { id: data.packageId } });
        if (!pkg) throw new Error("Package not found");
 
        const reservation = await prisma.packageReservation.create({
            data: {
                packageId: data.packageId,
                userId: pkg.userId,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                customerCountry: data.customerCountry,
                date: data.date,
                time: data.time,
                passengers: data.passengers,
                basePrice: data.basePrice,
                serviceFee: data.serviceFee,
                totalPrice: data.totalPrice,
                notes: data.notes,
                status: 'Confirmado'
            }
        });
        return { success: true, data: reservation };
    } catch (error) {
        console.error('Error creating package reservation:', error);
        return { success: false, error: 'Failed to create reservation' };
    }
}
 
export async function getDashboardReservations() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

        const reservations = await prisma.packageReservation.findMany({
            where: whereClause,
            include: { package: true },
            orderBy: [
                { date: 'asc' },
                { time: 'asc' }
            ],
            take: 10
        });

        return { success: true, data: reservations };
    } catch (error) {
        console.error('Error fetching dashboard reservations:', error);
        return { success: false, error: 'Failed to fetch reservations' };
    }
}

export async function getAllReservations() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

        const reservations = await prisma.packageReservation.findMany({
            where: whereClause,
            include: { package: true },
            orderBy: [
                { date: 'desc' },
                { time: 'desc' }
            ]
        });

        return { success: true, data: reservations };
    } catch (error) {
        console.error('Error fetching all reservations:', error);
        return { success: false, error: 'Failed to fetch reservations' };
    }
}

export async function getDashboardStats() {
    try {
        const user = await getCurrentUser();
        const baseWhere = {};
        const whereClause = (!user || user.role === 'ADMIN') ? baseWhere : { userId: user.id };
        const resWhereClause = (!user || user.role === 'ADMIN') ? baseWhere : { package: { userId: user.id } };

        const [totals, totalReservations, yachtCount, taxiCount] = await Promise.all([
            prisma.packageReservation.aggregate({
                where: resWhereClause,
                _sum: { totalPrice: true, serviceFee: true }
            }),
            prisma.packageReservation.count({
                where: resWhereClause
            }),
            prisma.yacht.count({
                where: whereClause
            }),
            prisma.taxi.count({
                where: whereClause
            })
        ]);

        return {
            success: true,
            data: {
                totalSales: totals._sum.totalPrice || 0,
                totalFees: totals._sum.serviceFee || 0,
                totalReservations,
                yachtCount,
                taxiCount
            }
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { success: false, error: 'Failed to fetch stats' };
    }
}

