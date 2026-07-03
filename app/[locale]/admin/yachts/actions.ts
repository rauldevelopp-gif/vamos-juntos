'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getYachts() {
    try {
        const user = await getCurrentUser();
        
        const whereClause = (!user || user.role === 'ADMIN') ? {} : { userId: user.id };

        console.log("getYachts: Fetching from DB...");
        let yachts = await prisma.yacht.findMany({
            where: whereClause,
            include: {
                crew: true
            },
            orderBy: {
                id: 'asc'
            }
        });

        console.log(`getYachts: Found ${yachts.length} yachts.`);

        // Seed if empty for demonstration
        if (yachts.length === 0 && (!user || user.role === 'ADMIN')) {
            console.log("getYachts: Table empty, seeding...");
            await seedInitialYachts();
            yachts = await prisma.yacht.findMany({
                where: whereClause,
                include: {
                    crew: true
                },
                orderBy: {
                    id: 'asc'
                }
            });
            console.log(`getYachts: Seeded and refetched ${yachts.length} yachts.`);
        }

        revalidatePath('/admin', 'layout');
        return { success: true, data: JSON.parse(JSON.stringify(yachts)) };
    } catch (error: unknown) {
        console.error("Error fetching yachts:", error);
        const message = error instanceof Error ? error.message : "Desconocido";
        const stack = error instanceof Error ? error.stack : undefined;
        return { 
            success: false, 
            error: "Error al obtener yates: " + message,
            details: stack
        };
    }
}

export async function createYacht(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        const newYacht = await prisma.yacht.create({
            data: {
                ...data,
                userId: user.id
            }
        });
        revalidatePath('/admin', 'layout');
        return { success: true, data: newYacht };
    } catch (error: unknown) {
        return { success: false, error: 'Error al crear yate' };
    }
}

export async function updateYacht(id: number, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        // Ensure owner or admin
        const existing = await prisma.yacht.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        const updatedYacht = await prisma.yacht.update({
            where: { id },
            data
        });
        revalidatePath('/admin', 'layout');
        return { success: true, data: updatedYacht };
    } catch (error: unknown) {
        return { success: false, error: 'Error al actualizar yate' };
    }
}

export async function deleteYacht(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const existing = await prisma.yacht.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        // Delete associated crew first since there's no cascade delete configured
        await prisma.crew.deleteMany({
            where: { yachtId: id }
        });

        await prisma.yacht.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting yacht:", error);
        return { success: false, error: 'Error al eliminar el yate' };
    }
}

export async function bulkCreateYachts(dataArray: any[]) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const findVal = (obj: any, keys: string[]) => {
            const entry = Object.entries(obj).find(([k]) => keys.includes(k.toLowerCase().trim()));
            return entry ? entry[1] : undefined;
        };

        const formattedData = dataArray.map(item => {
            const name = findVal(item, ['name', 'nombre']) || 'Sin nombre';
            const brand = findVal(item, ['brand', 'marca']) || 'Desconocida';
            const model = findVal(item, ['model', 'modelo']) || 'Desconocido';
            const year = parseInt(findVal(item, ['year', 'año', 'ano']) || '2023', 10);
            const length = findVal(item, ['length', 'eslora', 'tamaño']) || '0ft';
            const capacity = parseInt(findVal(item, ['capacity', 'capacidad', 'pasajeros']) || '10', 10);
            const price_day = parseFloat(findVal(item, ['price_day', 'precio', 'tarifa', 'precio por día']) || '0');
            const status = findVal(item, ['status', 'estado', 'estatus']) || 'Disponible';
            const location = findVal(item, ['location', 'ubicación', 'ubicacion', 'marina']) || 'Desconocida';
            const coordinates = findVal(item, ['coordinates', 'coordenadas']) || '';
            const description_long = findVal(item, ['description_long', 'descripción', 'descripcion']) || '';

            return {
                name,
                brand,
                model,
                year: isNaN(year) ? 2023 : year,
                length,
                capacity: isNaN(capacity) ? 10 : capacity,
                price_day: isNaN(price_day) ? 0 : price_day,
                status,
                location,
                coordinates,
                description_long,
                userId: user.id
            };
        });

        const result = await prisma.yacht.createMany({
            data: formattedData,
            skipDuplicates: true
        });

        return { success: true, count: result.count };
    } catch (error) {
        console.error("Error in bulk create yachts:", error);
        return { success: false, error: 'Error al importar datos' };
    }
}

export async function createCrew(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };
        
        const newCrew = await prisma.crew.create({
            data: {
                ...data,
                userId: user.id
            }
        });
        return { success: true, data: newCrew };
    } catch (error) {
        console.error("Error creating crew:", error);
        return { success: false, error: 'Error al crear tripulante' };
    }
}

export async function updateCrew(id: number, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const updated = await prisma.crew.update({
            where: { id },
            data
        });
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error updating crew:", error);
        return { success: false, error: 'Error al actualizar tripulante' };
    }
}

export async function deleteCrew(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        await prisma.crew.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting crew:", error);
        return { success: false, error: 'Error al eliminar tripulante' };
    }
}

async function seedInitialYachts() {
    try {
        const user = await getCurrentUser();
        const yachtsData = [
            {
                name: "Sea Diamond",
                brand: "Azimut",
                model: "60 Flybridge",
                year: 2022,
                length: "60ft",
                capacity: 12,
                price_day: 3500,
                status: "Disponible",
                location: "Marina Cancún",
                coordinates: "21.1465,-86.8219",
                userId: user?.id,
                crew: {
                    create: [
                        { 
                            name: "Cap. Roberto Mendez", 
                            role: "Capitán", 
                            experience: "15 años",
                            phone: "+52 998 123 4567",
                            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
                        },
                        { 
                            name: "Elena Solis", 
                            role: "Chef", 
                            experience: "8 años",
                            phone: "+52 998 765 4321",
                            photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
                        }
                    ]
                }
            },
            {
                name: "Blue Horizon",
                brand: "Sunseeker",
                model: "Manhattan 68",
                year: 2021,
                length: "68ft",
                capacity: 15,
                price_day: 4800,
                status: "Reservado",
                location: "Puerto Aventuras",
                coordinates: "20.5008,-87.2289",
                userId: user?.id,
                crew: {
                    create: [
                        { 
                            name: "Cap. Julian Rossi", 
                            role: "Capitán", 
                            experience: "20 años",
                            phone: "+52 984 111 2233",
                            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100"
                        },
                        { 
                            name: "Marco Polo", 
                            role: "Marinero", 
                            experience: "5 años",
                            phone: "+52 984 444 5566",
                            photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
                        }
                    ]
                }
            }
        ];

        for (const yacht of yachtsData) {
            await prisma.yacht.create({
                data: yacht
            });
        }
    } catch (e) {
        console.error("Seed error:", e);
    }
}

export async function getPublicYachts() {
    try {
        const yachts = await prisma.yacht.findMany({
            include: { crew: true },
            orderBy: { id: 'asc' }
        });
        revalidatePath('/admin', 'layout');
        return { success: true, data: JSON.parse(JSON.stringify(yachts)) };
    } catch (error: unknown) {
        return { success: false, error: 'Error al obtener yates' };
    }
}
