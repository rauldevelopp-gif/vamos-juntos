const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TOP_RESTAURANTS = [
    { name: 'Pujol', cuisine: 'Alta Cocina Mexicana', city: 'Polanco, CDMX', state: 'CDMX', status: 'Abierto', priceRange: '$$$$', coordinates: '19.4281,-99.2011' },
    { name: 'Quintonil', cuisine: 'Contemporánea Mexicana', city: 'Polanco, CDMX', state: 'CDMX', status: 'Abierto', priceRange: '$$$$', coordinates: '19.4291,-99.1981' },
    { name: 'Rosetta', cuisine: 'Italiana-Mexicana Fusion', city: 'Roma Norte, CDMX', state: 'CDMX', status: 'Abierto', priceRange: '$$$', coordinates: '19.4191,-99.1601' },
    { name: 'Fauna', cuisine: 'Cocina de Autor / Baja', city: 'Valle de Guadalupe', state: 'Baja California', status: 'Abierto', priceRange: '$$$$', coordinates: '32.0641,-116.6541' },
    { name: 'Pangea', cuisine: 'Contemporánea', city: 'San Pedro Garza García', state: 'Nuevo León', status: 'Abierto', priceRange: '$$$$', coordinates: '25.6441,-100.3541' },
    { name: 'Alcalde', cuisine: 'Cocina de Tierra', city: 'Guadalajara', state: 'Jalisco', status: 'Abierto', priceRange: '$$$', coordinates: '20.6741,-103.3641' },
    { name: 'Porfirio\'s', cuisine: 'Mexicana Contemporánea', city: 'Zona Hotelera', state: 'Cancún', status: 'Abierto', priceRange: '$$$', coordinates: '21.0941,-86.7641' },
    { name: 'Rosa Negra', cuisine: 'Iberoamericana Fusion', city: 'Zona Hotelera', state: 'Tulum', status: 'Abierto', priceRange: '$$$$', coordinates: '20.1441,-87.4741' },
    { name: 'Contramar', cuisine: 'Mariscos / Mexicana', city: 'Roma Norte, CDMX', state: 'CDMX', status: 'Abierto', priceRange: '$$$', coordinates: '19.4191,-99.1671' },
    { name: 'Criollo', cuisine: 'Cocina Oaxaqueña', city: 'Oaxaca de Juárez', state: 'Oaxaca', status: 'Abierto', priceRange: '$$$', coordinates: '17.0641,-96.7241' },
];

async function main() {
    console.log('Seeding restaurants...');
    for (const restaurant of TOP_RESTAURANTS) {
        await prisma.restaurant.create({
            data: restaurant,
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
