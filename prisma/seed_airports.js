const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MEXICAN_AIRPORTS = [
    { name: 'Aeropuerto Internacional de la Ciudad de México', location: 'Venustiano Carranza, CDMX', iata: 'MEX', city: 'Ciudad de México', state: 'CDMX', status: 'Operativo', coordinates: '19.4361,-99.0719' },
    { name: 'Aeropuerto Internacional de Cancún', location: 'Cancún, Quintana Roo', iata: 'CUN', city: 'Cancún', state: 'Quintana Roo', status: 'Operativo', coordinates: '21.0367,-86.8771' },
    { name: 'Aeropuerto Internacional de Guadalajara', location: 'Tlajomulco de Zúñiga, Jalisco', iata: 'GDL', city: 'Guadalajara', state: 'Jalisco', status: 'Operativo', coordinates: '20.5218,-103.3112' },
    { name: 'Aeropuerto Internacional de Monterrey', location: 'Apodaca, Nuevo León', iata: 'MTY', city: 'Monterrey', state: 'Nuevo León', status: 'Operativo', coordinates: '25.7785,-100.1069' },
    { name: 'Aeropuerto Internacional de Tijuana', location: 'Tijuana, Baja California', iata: 'TIJ', city: 'Tijuana', state: 'Baja California', status: 'Operativo', coordinates: '32.5411,-116.9702' },
    { name: 'Aeropuerto Internacional de Puerto Vallarta', location: 'Puerto Vallarta, Jalisco', iata: 'PVR', city: 'Puerto Vallarta', state: 'Jalisco', status: 'Operativo', coordinates: '20.6801,-105.2541' },
    { name: 'Aeropuerto Internacional de Los Cabos', location: 'San José del Cabo, BCS', iata: 'SJD', city: 'San José del Cabo', state: 'Baja California Sur', status: 'Operativo', coordinates: '23.1518,-109.7210' },
    { name: 'Aeropuerto Internacional de Mérida', location: 'Mérida, Yucatán', iata: 'MID', city: 'Mérida', state: 'Yucatán', status: 'Operativo', coordinates: '20.9370,-89.6577' },
    { name: 'Aeropuerto Internacional del Bajío', location: 'Silao, Guanajuato', iata: 'BJX', city: 'León', state: 'Guanajuato', status: 'Operativo', coordinates: '20.9935,-101.4808' },
    { name: 'Aeropuerto Internacional de Veracruz', location: 'Veracruz, Veracruz', iata: 'VER', city: 'Veracruz', state: 'Veracruz', status: 'Operativo', coordinates: '19.1459,-96.1873' },
];

async function main() {
    console.log('Seeding airports...');
    for (const airport of MEXICAN_AIRPORTS) {
        await prisma.airport.upsert({
            where: { iata: airport.iata },
            update: airport,
            create: airport,
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
