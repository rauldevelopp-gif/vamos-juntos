const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const attractionsData = {
        'Chichén Itzá': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/800px-Chichen_Itza_3.jpg',
        'Pirámides de Teotihuacán': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pir%C3%A1mide_del_Sol_en_Teotihuacan.jpg/800px-Pir%C3%A1mide_del_Sol_en_Teotihuacan.jpg',
        'Castillo de Chapultepec': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Castillo_Chapultepec.jpg/800px-Castillo_Chapultepec.jpg',
        'Parque Xcaret': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Xcaret_Park%2C_Quintana_Roo%2C_Mexico_%281%29.jpg/800px-Xcaret_Park%2C_Quintana_Roo%2C_Mexico_%281%29.jpg',
        'Zona Arqueológica de Tulum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Tulum_Ruins.jpg/800px-Tulum_Ruins.jpg',
        'Cañón del Sumidero': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ca%C3%B1on_del_Sumidero.jpg/800px-Ca%C3%B1on_del_Sumidero.jpg',
        'Museo Frida Kahlo (Casa Azul)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Museo_Frida_Kahlo.jpg/800px-Museo_Frida_Kahlo.jpg',
        'Palenque': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Palenque_Ruins.jpg/800px-Palenque_Ruins.jpg',
        'Barrancas del Cobre': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Barranca_del_cobre_-_panoramio_%283%29.jpg/800px-Barranca_del_cobre_-_panoramio_%283%29.jpg',
        'Monte Albán': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Monte_Alban_Overview.jpg/800px-Monte_Alban_Overview.jpg',
        'Ruinas Mayas de Tulum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Tulum_Ruins.jpg/800px-Tulum_Ruins.jpg'
    };

    const attractions = await prisma.attraction.findMany();
    for (const attr of attractions) {
        if (attractionsData[attr.name]) {
            await prisma.attraction.update({
                where: { id: attr.id },
                data: {
                    gallery: [attractionsData[attr.name]]
                }
            });
            console.log(`Updated attraction image: ${attr.name}`);
        }
    }

    const beachesData = {
        'Playa Sayulita': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sayulita_beach.jpg/800px-Sayulita_beach.jpg',
        'Playa Paraíso': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Tulum_beach_Quintana_Roo_Mexico.jpg/800px-Tulum_beach_Quintana_Roo_Mexico.jpg'
    };
    const beaches = await prisma.beach.findMany();
    for (const beach of beaches) {
        if (beachesData[beach.name]) {
            await prisma.beach.update({
                where: { id: beach.id },
                data: {
                    gallery: [beachesData[beach.name]]
                }
            });
            console.log(`Updated beach image: ${beach.name}`);
        }
    }
}

main().finally(() => prisma.$disconnect());
