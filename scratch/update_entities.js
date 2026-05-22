const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // BEACHES
    const beachesData = {
        'Playa Norte': {
            desc: 'Considerada una de las mejores playas del mundo, Playa Norte en Isla Mujeres te enamorará con su arena blanca que parece talco y sus aguas cristalinas, tranquilas y poco profundas. Es el lugar perfecto para relajarse, nadar sin preocupaciones y contemplar los atardeceres más espectaculares del Caribe Mexicano en un ambiente relajado y paradisíaco.',
            img: '/uploads/playa_norte.png'
        },
        'Playa Balandra': {
            desc: 'Famosa por su icónica formación rocosa en forma de hongo, Playa Balandra es una maravilla natural de La Paz, Baja California Sur. Sus aguas extremadamente poco profundas, serenas y de un impresionante tono turquesa están rodeadas de cerros desérticos y manglares, creando un contraste visual único y un ecosistema prístino ideal para el ecoturismo.',
            img: '/uploads/playa_balandra.png'
        },
        'Playa del Amor': {
            desc: 'Escondida en el interior de un cráter natural en las Islas Marietas, la Playa del Amor (o Playa Escondida) es uno de los secretos mejor guardados de México. Para llegar a ella es necesario nadar a través de un túnel rocoso corto. Una vez dentro, te espera un oasis aislado de arena blanca, bañado por el sol y el agua cristalina del Pacífico.',
            img: '/uploads/playa_del_amor.png'
        },
        'Playa Akumal': {
            desc: 'Akumal, cuyo nombre maya significa "Lugar de Tortugas", hace honor a su nombre ofreciendo la oportunidad única de nadar junto a tortugas marinas en su hábitat natural. Esta hermosa bahía protegida por un arrecife de coral es un paraíso para el snorkel, con aguas mansas, transparentes y una abundante vida marina a solo unos metros de la orilla.',
            img: '/uploads/playa_akumal.png'
        },
        'Playa Delfines': {
            desc: 'Uno de los miradores más famosos de Cancún y hogar del icónico letrero colorido. Playa Delfines ofrece una vista panorámica impresionante del vasto e intenso mar Caribe. Con kilómetros de suave arena blanca y olas perfectas para refrescarse, es el lugar ideal para pasar un día bajo el sol caribeño con todas las comodidades.',
            img: '/uploads/playa_delfines.png'
        },
        'Playa Maroma': {
            desc: 'Playa Maroma, en el corazón de la Riviera Maya, se distingue por su ambiente de exclusividad y lujo sereno. Con su extensa costa de arena blanca finísima, rodeada de exuberante selva tropical y hoteles de clase mundial, es un verdadero refugio tropical que promete una experiencia de playa inigualable y sumamente relajante.',
            img: '/uploads/playa_maroma.png'
        },
        'Playa Carrizalillo': {
            desc: 'A esta pintoresca y vibrante caleta en Puerto Escondido se accede bajando por una empinada escalera de piedra. El esfuerzo vale totalmente la pena: te espera una playa de arena dorada rodeada de acantilados cubiertos de palmeras, con olas perfectas para aprender a surfear y un ambiente relajado lleno de energía positiva.',
            img: '/uploads/playa_carrizalillo.png'
        },
        'Playa Sayulita': {
            desc: 'El corazón bohemio de la Riviera Nayarit. Sayulita es una playa vibrante y llena de vida, famosa por su excelente oleaje para surfistas de todos los niveles, sus calles coloridas llenas de arte huichol y su ambiente cosmopolita y relajado. Es el destino perfecto para quienes buscan sol, surf y buena vibra.',
            img: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=600&auto=format&fit=crop'
        },
        'Playa Paraíso': {
            desc: 'Haciendo honor absoluto a su nombre, Playa Paraíso en Tulum combina la belleza natural del Caribe con una atmósfera rústica-chic inigualable. Arena deslumbrantemente blanca, palmeras icónicas inclinadas sobre el mar azul turquesa y beach clubs de primer nivel se unen para ofrecer la experiencia caribeña definitiva.',
            img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600&auto=format&fit=crop'
        }
    };

    const beaches = await prisma.beach.findMany();
    for (const beach of beaches) {
        if (beachesData[beach.name]) {
            await prisma.beach.update({
                where: { id: beach.id },
                data: {
                    description_long: beachesData[beach.name].desc,
                    gallery: [beachesData[beach.name].img]
                }
            });
            console.log(`Updated beach: ${beach.name}`);
        }
    }

    // ATTRACTIONS
    const attractionsData = {
        'Chichén Itzá': {
            desc: 'Una de las Nuevas Siete Maravillas del Mundo Moderno y símbolo por excelencia de la grandeza maya. Recorre la imponente Pirámide de Kukulcán (El Castillo), el gigantesco Juego de Pelota, el Observatorio y el Cenote Sagrado. Un viaje fascinante a través de la historia, la astronomía y la arquitectura de una de las civilizaciones más avanzadas de Mesoamérica.',
            img: 'https://images.unsplash.com/photo-1518182170546-07661607baaf?q=80&w=600&auto=format&fit=crop'
        },
        'Pirámides de Teotihuacán': {
            desc: 'Explora "La Ciudad de los Dioses", uno de los complejos arqueológicos más impresionantes y extensos de México. Sube la monumental Pirámide del Sol, maravíllate con la Pirámide de la Luna y camina por la vasta Calzada de los Muertos. Un lugar lleno de misterio, energía y vistas impresionantes del altiplano.',
            img: 'https://images.unsplash.com/photo-1583800688327-02095ce81229?q=80&w=600&auto=format&fit=crop'
        },
        'Castillo de Chapultepec': {
            desc: 'Ubicado en lo alto del Cerro del Chapulín, este es el único castillo real de América y fue hogar del emperador Maximiliano de Habsburgo. Hoy alberga el Museo Nacional de Historia. Recorre sus opulentos salones con mobiliario original, sus carruajes históricos y disfruta de las vistas panorámicas más bellas de la Ciudad de México y su extenso bosque.',
            img: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=600&auto=format&fit=crop'
        },
        'Parque Xcaret': {
            desc: 'Más que un parque ecológico, Xcaret es una celebración majestuosa de la cultura, la flora y la fauna mexicana. Sumérgete en sus ríos subterráneos cristalinos, explora el aviario, el mariposario, relájate en sus caletas privadas y no te pierdas el espectacular show nocturno "Xcaret México Espectacular" que recorre la historia del país a través de la música y la danza.',
            img: 'https://images.unsplash.com/photo-1533750013093-605bb9930f76?q=80&w=600&auto=format&fit=crop'
        },
        'Zona Arqueológica de Tulum': {
            desc: 'La antigua ciudad amurallada maya de Tulum goza de una de las ubicaciones más espectaculares del mundo: un acantilado frente a las aguas turquesas del Mar Caribe. Conoce la historia de esta antigua ciudad puerto mientras admiras El Castillo y el Templo de los Frescos, para luego descender a disfrutar de un merecido baño en su preciosa playa adyacente.',
            img: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810?q=80&w=600&auto=format&fit=crop'
        },
        'Cañón del Sumidero': {
            desc: 'Navega por las aguas del Río Grijalva a través de las monumentales y vertiginosas paredes del Cañón del Sumidero, algunas de las cuales alcanzan hasta 1,000 metros de altura. Durante el recorrido podrás observar cocodrilos, monos araña, pelícanos y espectaculares formaciones naturales como la cascada "Árbol de Navidad". Una experiencia natural sobrecogedora.',
            img: 'https://images.unsplash.com/photo-1582296726207-88f6a96f12dd?q=80&w=600&auto=format&fit=crop'
        },
        'Museo Frida Kahlo (Casa Azul)': {
            desc: 'Entra al universo íntimo y colorido de una de las artistas más célebres de México. Ubicada en el bohemio centro de Coyoacán, la Casa Azul fue el hogar donde Frida Kahlo nació, vivió gran parte de su vida y murió. Descubre sus obras, sus objetos personales, su ropa tradicional, su caballete y el hermoso jardín central que tanto la inspiraba.',
            img: 'https://images.unsplash.com/photo-1618395155913-7fdfaf204a9e?q=80&w=600&auto=format&fit=crop'
        },
        'Palenque': {
            desc: 'Oculta en la espesa selva tropical de Chiapas, Palenque es una zona arqueológica maya de inigualable elegancia arquitectónica. Maravíllate con el Templo de las Inscripciones, donde se encontró la famosa tumba del Rey Pakal, el Palacio con su singular torre y escucha los sonidos envolventes de la selva y los monos aulladores mientras exploras.',
            img: 'https://images.unsplash.com/photo-1590240974865-c7255952c1e4?q=80&w=600&auto=format&fit=crop'
        },
        'Barrancas del Cobre': {
            desc: 'Un sistema de cañones en la Sierra Tarahumara que es más largo y profundo que el Gran Cañón de Arizona. Disfruta de vistas vertiginosas, viaja a través de túneles y puentes impresionantes en el tren El Chepe, vuela en la tirolesa más larga del mundo y descubre la rica cultura del milenario pueblo Rarámuri en este paisaje majestuoso e indomable.',
            img: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=600&auto=format&fit=crop'
        },
        'Monte Albán': {
            desc: 'Asciende a la antigua capital del Imperio Zapoteca, construida majestuosamente sobre una montaña aplanada que domina visualmente los Valles Centrales de Oaxaca. Explora la Gran Plaza, el Observatorio Astronómico, el Juego de Pelota y las singulares estelas de "Los Danzantes". Una experiencia mística cargada de historia.',
            img: 'https://images.unsplash.com/photo-1588693895105-0210e7b25055?q=80&w=600&auto=format&fit=crop'
        },
        'Ruinas Mayas de Tulum': {
            desc: 'Explora esta mágica ciudad amurallada maya a orillas del cristalino Mar Caribe. Un tesoro histórico donde la grandeza arquitectónica prehispánica se combina en perfecta armonía con el paisaje natural inigualable de la Riviera Maya. Un sitio de visita obligatoria.',
            img: 'https://images.unsplash.com/photo-1542640244-7e672d6cb466?q=80&w=600&auto=format&fit=crop'
        }
    };

    const attractions = await prisma.attraction.findMany();
    for (const attr of attractions) {
        if (attractionsData[attr.name]) {
            await prisma.attraction.update({
                where: { id: attr.id },
                data: {
                    description_long: attractionsData[attr.name].desc,
                    gallery: [attractionsData[attr.name].img]
                }
            });
            console.log(`Updated attraction: ${attr.name}`);
        }
    }
}

main().finally(() => prisma.$disconnect());
