'use server';

import prisma from '@/lib/db';

export async function getYachts() {
    try {
        console.log("getYachts: Fetching from DB...");
        let yachts = await prisma.yacht.findMany({
            include: {
                crew: true
            },
            orderBy: {
                id: 'asc'
            }
        });

        console.log(`getYachts: Found ${yachts.length} yachts.`);

        // Seed if empty for demonstration
        if (yachts.length === 0) {
            console.log("getYachts: Table empty, seeding...");
            await seedInitialYachts();
            yachts = await prisma.yacht.findMany({
                include: {
                    crew: true
                },
                orderBy: {
                    id: 'asc'
                }
            });
            console.log(`getYachts: Seeded and refetched ${yachts.length} yachts.`);
        }

        return { success: true, data: JSON.parse(JSON.stringify(yachts)) };
    } catch (error: any) {
        console.error("Error fetching yachts:", error);
        return { 
            success: false, 
            error: "Error al obtener yates: " + (error.message || "Desconocido"),
            details: error.stack
        };
    }
}

async function seedInitialYachts() {
    try {
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
