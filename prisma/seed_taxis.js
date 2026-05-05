const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FLEET_DATA = [
    { 
        plate: 'VJP-1234', brand: 'Toyota', model: 'Camry', year: 2023, color: 'Blanco', type: 'Sedán', passengers: 4, luggage: 3, 
        amenities: ['Música', 'A/C', 'Mascotas'], status: 'Disponible',
        driver: { name: 'Juan Carlos Pérez', phone: '+52 555-123-4567', license: 'MX-998877', expiration: '2026-12-15', rating: 4.8, photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop' }
    },
    { 
        plate: 'VJP-5678', brand: 'Chevrolet', model: 'Suburban', year: 2022, color: 'Negro', type: 'SUV', passengers: 7, luggage: 6, 
        amenities: ['Música', 'A/C', 'Fumar', 'Bar'], status: 'En Viaje',
        driver: { name: 'Roberto Gómez', phone: '+52 555-987-6543', license: 'MX-445566', expiration: '2025-08-20', rating: 4.9, photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' }
    },
    { 
        plate: 'VJP-9012', brand: 'Mercedes-Benz', model: 'V-Class', year: 2024, color: 'Gris Plata', type: 'Premium', passengers: 6, luggage: 5, 
        amenities: ['Música', 'A/C', 'WiFi', 'Bebidas'], status: 'Disponible',
        driver: { name: 'Elena Rodríguez', phone: '+52 555-222-3344', license: 'MX-112233', expiration: '2027-05-10', rating: 5.0, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }
    }
];

async function main() {
    console.log('Seeding taxis and drivers...');
    for (const item of FLEET_DATA) {
        const { driver: driverData, ...taxiData } = item;
        
        // Create or find driver
        const driver = await prisma.driver.create({
            data: driverData
        });

        // Create taxi
        await prisma.taxi.create({
            data: {
                ...taxiData,
                driverId: driver.id
            }
        });
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
