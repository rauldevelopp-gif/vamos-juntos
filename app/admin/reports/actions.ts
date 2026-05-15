'use server';

import prisma from '@/lib/db';

export async function getEffectiveReservations() {
    try {
        const count = await prisma.reservation.count({
            where: {
                status: {
                    not: 'CANCELLED'
                }
            }
        });
        
        // Also get packages sold as effective reservations
        const packages = await prisma.package.aggregate({
            _sum: {
                sales: true
            }
        });

        const totalEffective = count + (packages._sum.sales || 0);
        return { success: true, count: totalEffective };
    } catch (error) {
        console.error("Error getting effective reservations:", error);
        return { success: false, error: "Failed to fetch reservations" };
    }
}

export async function getMonthlyRevenue() {
    try {
        // Fetch all non-cancelled reservations
        const reservations = await prisma.reservation.findMany({
            where: { status: { not: 'CANCELLED' } },
            select: { date: true, totalAmount: true }
        });

        // Group by month
        const revenueByMonth: Record<string, number> = {};
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        reservations.forEach(res => {
            const date = new Date(res.date);
            const monthStr = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            if (!revenueByMonth[monthStr]) {
                revenueByMonth[monthStr] = 0;
            }
            revenueByMonth[monthStr] += res.totalAmount;
        });

        // Also add package sales revenue (simplified, assuming all sales happened in current month for demo if date isn't easily parsed, but let's try to parse)
        const packages = await prisma.package.findMany({
            where: { sales: { gt: 0 } },
            select: { date: true, price: true, sales: true }
        });

        packages.forEach(pkg => {
            const date = new Date(pkg.date); // pkg.date is a string, assuming ISO format
            if (!isNaN(date.getTime())) {
                const monthStr = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                if (!revenueByMonth[monthStr]) {
                    revenueByMonth[monthStr] = 0;
                }
                revenueByMonth[monthStr] += (pkg.price * pkg.sales);
            } else {
                 // Fallback to current month if date is invalid
                 const now = new Date();
                 const monthStr = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
                 if (!revenueByMonth[monthStr]) revenueByMonth[monthStr] = 0;
                 revenueByMonth[monthStr] += (pkg.price * pkg.sales);
            }
        });

        const data = Object.keys(revenueByMonth).map(month => ({
            name: month,
            Ingresos: revenueByMonth[month]
        }));

        // Sort by date roughly (this is a simple sort, assumes same year for simplicity or relies on string order if not careful. Let's just return as is for now)
        return { success: true, data };
    } catch (error) {
        console.error("Error getting monthly revenue:", error);
        return { success: false, error: "Failed to fetch revenue" };
    }
}

export async function getDriverRankings() {
    try {
        const drivers = await prisma.driver.findMany({
            orderBy: { rating: 'desc' },
            take: 10,
            select: { name: true, rating: true, id: true }
        });
        
        const data = drivers.map(d => ({
            name: d.name.split(' ')[0], // First name for shorter labels
            Puntuacion: d.rating
        }));
        
        return { success: true, data };
    } catch (error) {
        console.error("Error getting driver rankings:", error);
        return { success: false, error: "Failed to fetch driver rankings" };
    }
}

export async function getPopularDestinations() {
    try {
        const services = await prisma.reservationService.findMany({
            include: {
                place: true,
                beach: true,
                attraction: true,
                hotel: true,
                restaurant: true
            }
        });

        const counts: Record<string, number> = {};

        services.forEach(srv => {
            let name = null;
            if (srv.place) name = srv.place.name;
            else if (srv.beach) name = srv.beach.name;
            else if (srv.attraction) name = srv.attraction.name;
            else if (srv.hotel) name = srv.hotel.name;
            else if (srv.restaurant) name = srv.restaurant.name;

            if (name) {
                counts[name] = (counts[name] || 0) + srv.quantity;
            }
        });

        const data = Object.entries(counts)
            .map(([name, Selecciones]) => ({ name, Selecciones }))
            .sort((a, b) => b.Selecciones - a.Selecciones)
            .slice(0, 10); // Top 10

        return { success: true, data };
    } catch (error) {
        console.error("Error getting popular destinations:", error);
        return { success: false, error: "Failed to fetch destinations" };
    }
}

export async function getAvailabilityStats() {
    try {
        const [driversAvailable, driversTotal, yachtsAvailable, yachtsTotal] = await Promise.all([
            prisma.driver.count({ where: { availability: true } }),
            prisma.driver.count(),
            prisma.yacht.count({ where: { availability: true } }),
            prisma.yacht.count()
        ]);

        const driverData = [
            { name: 'Disponibles', value: driversAvailable, fill: '#10b981' },
            { name: 'Ocupados', value: driversTotal - driversAvailable, fill: '#ef4444' }
        ];

        const yachtData = [
            { name: 'Disponibles', value: yachtsAvailable, fill: '#3b82f6' },
            { name: 'Ocupados', value: yachtsTotal - yachtsAvailable, fill: '#ef4444' }
        ];

        return { 
            success: true, 
            drivers: { data: driverData, total: driversTotal, available: driversAvailable }, 
            yachts: { data: yachtData, total: yachtsTotal, available: yachtsAvailable } 
        };
    } catch (error) {
        console.error("Error getting availability stats:", error);
        return { success: false, error: "Failed to fetch availability" };
    }
}
