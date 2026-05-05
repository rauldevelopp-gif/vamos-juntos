const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LUXURY_HOTELS = [
    { name: 'Four Seasons Hotel Mexico City', location: 'Paseo de la Reforma, CDMX', stars: 5, city: 'Ciudad de México', state: 'CDMX', status: 'Disponible', coordinates: '19.4244,-99.1741' },
    { name: 'Rosewood San Miguel de Allende', location: 'Nemesio Diez 11, Centro', stars: 5, city: 'San Miguel de Allende', state: 'Guanajuato', status: 'Disponible', coordinates: '20.9103,-100.7437' },
    { name: 'Nizuc Resort & Spa', location: 'Blvd. Kukulcán, Zona Hotelera', stars: 5, city: 'Cancún', state: 'Quintana Roo', status: 'Lleno', coordinates: '21.0211,-86.7811' },
    { name: 'The St. Regis Punta Mita Resort', location: 'Lote H-4, Carr. Federal 200', stars: 5, city: 'Punta Mita', state: 'Nayarit', status: 'Disponible', coordinates: '20.7725,-105.5184' },
    { name: 'Hotel Xcaret México', location: 'Carretera Chetumal-Puerto Juárez', stars: 5, city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Disponible', coordinates: '20.5841,-87.1141' },
    { name: 'Viceroy Los Cabos', location: 'Paseo Malecon San Jose Lote 8', stars: 5, city: 'San José del Cabo', state: 'BCS', status: 'Mantenimiento', coordinates: '23.0541,-109.6841' },
    { name: 'Banyan Tree Cabo Marqués', location: 'Blvd. Cabo Marqués, Lote 1', stars: 5, city: 'Acapulco', state: 'Guerrero', status: 'Disponible', coordinates: '16.8041,-99.8241' },
    { name: 'Hacienda de San Antonio', location: 'Domicilio Conocido, Comala', stars: 5, city: 'Comala', state: 'Colima', status: 'Disponible', coordinates: '19.4541,-103.7141' },
    { name: 'Belmond Maroma Resort & Spa', location: 'Carretera Cancún-Tulum', stars: 5, city: 'Riviera Maya', state: 'Quintana Roo', status: 'Disponible', coordinates: '20.7385,-86.9669' },
    { name: 'One&Only Palmilla', location: 'Carr. Transpeninsular Km 7.5', stars: 5, city: 'Los Cabos', state: 'BCS', status: 'Disponible', coordinates: '23.0125,-109.7118' },
];

async function main() {
    console.log('Seeding hotels...');
    for (const hotel of LUXURY_HOTELS) {
        await prisma.hotel.create({
            data: hotel,
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
