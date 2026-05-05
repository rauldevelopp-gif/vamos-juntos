const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding 8 Elite Yachts and their Crews...');

    // Delete existing yachts and crew to start fresh if needed
    // WARNING: This will clear the table
    await prisma.crew.deleteMany({});
    await prisma.yacht.deleteMany({});

    const yachts = [
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
                    { name: "Cap. Roberto Mendez", role: "Capitán", experience: "15 años", phone: "+52 998 123 4567", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
                    { name: "Elena Solis", role: "Chef", experience: "8 años", phone: "+52 998 765 4321", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" }
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
                    { name: "Cap. Julian Rossi", role: "Capitán", experience: "20 años", phone: "+52 984 111 2233", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
                    { name: "Marco Polo", role: "Marinero", experience: "5 años", phone: "+52 984 444 5566", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" }
                ]
            }
        },
        {
            name: "Ocean Spirit",
            brand: "Ferretti",
            model: "780 Tai He Ban",
            year: 2023,
            length: "78ft",
            capacity: 20,
            price_day: 6200,
            status: "Disponible",
            location: "Marina La Paz",
            coordinates: "24.1623,-110.3242",
            crew: {
                create: [
                    { name: "Cap. Andres Vega", role: "Capitán", experience: "18 años", phone: "+52 612 999 8877", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150" },
                    { name: "Sofia Luna", role: "Hostess", experience: "6 años", phone: "+52 612 777 6655", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" }
                ]
            }
        },
        {
            name: "Golden Sun",
            brand: "Princess",
            model: "Y85",
            year: 2020,
            length: "85ft",
            capacity: 18,
            price_day: 7500,
            status: "Mantenimiento",
            location: "Puerto Vallarta",
            coordinates: "20.6668,-105.2403",
            crew: {
                create: [
                    { name: "Cap. Luis Torres", role: "Capitán", experience: "25 años", phone: "+52 322 555 4433", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150" }
                ]
            }
        },
        {
            name: "Silver Moon",
            brand: "Pershing",
            model: "8X",
            year: 2022,
            length: "83ft",
            capacity: 10,
            price_day: 8900,
            status: "Disponible",
            location: "Isla Mujeres",
            coordinates: "21.2321,-86.7334",
            crew: {
                create: [
                    { name: "Cap. Fabio Romano", role: "Capitán", experience: "12 años", phone: "+52 998 000 1111", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150" },
                    { name: "Lucia Santos", role: "Chef Executive", experience: "15 años", phone: "+52 998 222 3333", photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150" }
                ]
            }
        },
        {
            name: "Emerald Wave",
            brand: "Benetti",
            model: "Oasis 40M",
            year: 2023,
            length: "133ft",
            capacity: 25,
            price_day: 12500,
            status: "Disponible",
            location: "Los Cabos",
            coordinates: "22.8905,-109.9167",
            crew: {
                create: [
                    { name: "Cap. Jonathan Smith", role: "Capitán", experience: "30 años", phone: "+52 624 123 0000", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" },
                    { name: "Marie Claire", role: "Purser", experience: "10 años", phone: "+52 624 456 1111", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
                    { name: "David Beck", role: "Ingeniero", experience: "20 años", phone: "+52 624 789 2222", photo: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150" }
                ]
            }
        },
        {
            name: "Royal Explorer",
            brand: "Sanlorenzo",
            model: "SX88",
            year: 2019,
            length: "88ft",
            capacity: 12,
            price_day: 5500,
            status: "Disponible",
            location: "Cozumel",
            coordinates: "20.5017,-86.9455",
            crew: {
                create: [
                    { name: "Cap. Ricardo Ruiz", role: "Capitán", experience: "14 años", phone: "+52 987 888 9999", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" }
                ]
            }
        },
        {
            name: "Majestic Star",
            brand: "Riva",
            model: "110 Dolcevita",
            year: 2022,
            length: "110ft",
            capacity: 22,
            price_day: 11000,
            status: "Disponible",
            location: "Acapulco",
            coordinates: "16.8531,-99.8237",
            crew: {
                create: [
                    { name: "Cap. Gabriel Garcia", role: "Capitán", experience: "22 años", phone: "+52 744 111 0000", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
                    { name: "Isabella Moretti", role: "Stew", experience: "4 años", phone: "+52 744 222 3333", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150" }
                ]
            }
        }
    ];

    for (const yacht of yachts) {
        await prisma.yacht.create({
            data: yacht
        });
    }

    console.log('Successfully seeded 8 yachts with their professional crews!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
