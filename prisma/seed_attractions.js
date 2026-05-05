const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TOP_ATTRACTIONS = [
    { name: 'Chichén Itzá', category: 'Zona Arqueológica', city: 'Tinum', state: 'Yucatán', status: 'Abierto', recommendedTime: '3-4 Horas', coordinates: '20.6841,-88.5671' },
    { name: 'Pirámides de Teotihuacán', category: 'Zona Arqueológica', city: 'Teotihuacán', state: 'Edo. de México', status: 'Abierto', recommendedTime: '4-5 Horas', coordinates: '19.6921,-98.8431' },
    { name: 'Castillo de Chapultepec', category: 'Museo / Histórico', city: 'Ciudad de México', state: 'CDMX', status: 'Abierto', recommendedTime: '2-3 Horas', coordinates: '19.4201,-99.1811' },
    { name: 'Parque Xcaret', category: 'Eco-Parque Temático', city: 'Playa del Carmen', state: 'Quintana Roo', status: 'Abierto', recommendedTime: 'Todo el día', coordinates: '20.5801,-87.1191' },
    { name: 'Zona Arqueológica de Tulum', category: 'Zona Arqueológica', city: 'Tulum', state: 'Quintana Roo', status: 'Abierto', recommendedTime: '2 Horas', coordinates: '20.2141,-87.4291' },
    { name: 'Cañón del Sumidero', category: 'Parque Nacional', city: 'Chiapa de Corzo', state: 'Chiapas', status: 'Abierto', recommendedTime: '3 Horas', coordinates: '16.8331,-93.0831' },
    { name: 'Museo Frida Kahlo (Casa Azul)', category: 'Museo de Arte', city: 'Coyoacán', state: 'CDMX', status: 'Abierto', recommendedTime: '1.5 Horas', coordinates: '19.3551,-99.1621' },
    { name: 'Palenque', category: 'Zona Arqueológica', city: 'Palenque', state: 'Chiapas', status: 'Restauración', recommendedTime: '4 Horas', coordinates: '17.4841,-92.0461' },
    { name: 'Barrancas del Cobre', category: 'Parque Nacional', city: 'Creel', state: 'Chihuahua', status: 'Abierto', recommendedTime: '1-2 Días', coordinates: '27.5041,-107.7541' },
    { name: 'Monte Albán', category: 'Zona Arqueológica', city: 'Oaxaca de Juárez', state: 'Oaxaca', status: 'Abierto', recommendedTime: '3 Horas', coordinates: '17.0441,-96.7641' },
];

async function main() {
    console.log('Seeding attractions...');
    for (const attraction of TOP_ATTRACTIONS) {
        await prisma.attraction.create({
            data: attraction,
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
