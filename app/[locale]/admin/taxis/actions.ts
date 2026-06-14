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

export async function getDrivers() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const drivers = await prisma.driver.findMany({
            where: user.role === 'ADMIN' ? {} : { userId: user.id },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: drivers };
    } catch (error) {
        return { success: false, error: 'Error al obtener choferes' };
    }
}

export async function createTaxi(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const { driverName, driverLicense, driverPhone, driverExpiration, driverPhoto, gallery, ...taxiData } = data;

        const newDriver = await prisma.driver.create({
            data: {
                name: driverName || 'Sin Nombre',
                license: driverLicense || 'PENDIENTE',
                phone: driverPhone || '',
                expiration: driverExpiration || null,
                photo: driverPhoto || null,
                userId: user.id
            }
        });

        const newTaxi = await prisma.taxi.create({
            data: {
                ...taxiData,
                gallery: gallery || [],
                driverId: newDriver.id,
                userId: user.id
            }
        });
        return { success: true, data: newTaxi };
    } catch (error: any) {
        if (error.code === 'P2002') return { success: false, error: 'Ya existe un taxi con esta placa' };
        return { success: false, error: 'Error al crear taxi' };
    }
}

export async function updateTaxi(id: number, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const existing = await prisma.taxi.findUnique({ where: { id }, include: { driver: true } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        const { driverName, driverLicense, driverPhone, driverExpiration, driverPhoto, gallery, ...taxiData } = data;

        if (existing.driver) {
            await prisma.driver.update({
                where: { id: existing.driver.id },
                data: {
                    name: driverName,
                    license: driverLicense,
                    phone: driverPhone,
                    expiration: driverExpiration || null,
                    photo: driverPhoto || null
                }
            });
        }

        const updated = await prisma.taxi.update({
            where: { id },
            data: {
                ...taxiData,
                gallery: gallery || []
            }
        });
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error al actualizar taxi:", error);
        if (error.code === 'P2002') return { success: false, error: 'Ya existe un taxi con esta placa' };
        return { success: false, error: 'Error al actualizar taxi' };
    }
}

export async function deleteTaxi(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const existing = await prisma.taxi.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        await prisma.taxi.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Error al eliminar taxi' };
    }
}

export async function bulkCreateTaxis(dataArray: any[]) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const findVal = (obj: any, keys: string[]) => {
            const entry = Object.entries(obj).find(([k]) => keys.includes(k.toLowerCase().trim()));
            return entry ? entry[1] : undefined;
        };

        // Find or create default driver
        let defaultDriver = await prisma.driver.findFirst({
            where: { name: 'Conductor No Asignado', userId: user.id }
        });
        if (!defaultDriver) {
            defaultDriver = await prisma.driver.create({
                data: {
                    name: 'Conductor No Asignado',
                    license: 'PENDIENTE',
                    phone: '0000000000',
                    userId: user.id
                }
            });
        }

        const formattedData = [];
        for (const item of dataArray) {
            const plate = String(findVal(item, ['plate', 'placa', 'matricula', 'matrícula']) || `NO-PLATE-${Math.floor(Math.random() * 10000)}`);
            const brand = findVal(item, ['brand', 'marca']) || 'Desconocida';
            const model = findVal(item, ['model', 'modelo']) || 'Desconocido';
            const year = parseInt(findVal(item, ['year', 'año', 'ano']) || '2023', 10);
            const color = findVal(item, ['color']) || 'Blanco';
            const type = findVal(item, ['type', 'tipo', 'categoría']) || 'Sedan';
            const passengers = parseInt(findVal(item, ['passengers', 'pasajeros', 'capacidad']) || '4', 10);
            const luggage = parseInt(findVal(item, ['luggage', 'equipaje', 'maletas']) || '2', 10);
            const status = findVal(item, ['status', 'estado', 'estatus']) || 'Disponible';
            const amenitiesStr = findVal(item, ['amenities', 'amenidades']) || '';
            const amenities = amenitiesStr ? amenitiesStr.split(',').map((s: string) => s.trim()) : [];

            // Handle driver
            const driverName = findVal(item, ['driver_name', 'chofer', 'conductor']);
            let driverId = defaultDriver.id;

            if (driverName) {
                let driver = await prisma.driver.findFirst({ where: { name: driverName, userId: user.id } });
                if (!driver) {
                    driver = await prisma.driver.create({
                        data: {
                            name: driverName,
                            license: findVal(item, ['driver_license', 'licencia']) || 'PENDIENTE',
                            phone: String(findVal(item, ['driver_phone', 'telefono']) || '0000000000'),
                            userId: user.id
                        }
                    });
                }
                driverId = driver.id;
            }

            formattedData.push({
                plate,
                brand,
                model,
                year: isNaN(year) ? 2023 : year,
                color,
                type,
                passengers: isNaN(passengers) ? 4 : passengers,
                luggage: isNaN(luggage) ? 2 : luggage,
                amenities,
                status,
                driverId,
                userId: user.id
            });
        }

        const result = await prisma.taxi.createMany({
            data: formattedData,
            skipDuplicates: true
        });

        return { success: true, count: result.count };
    } catch (error) {
        console.error("Error in bulk create taxis:", error);
        return { success: false, error: 'Error al importar datos' };
    }
}
