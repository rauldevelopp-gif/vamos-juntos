const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const yachts = await prisma.yacht.findMany();
  
  const updates = {
    'Ocean Spirit': {
      desc: 'Navega por las aguas más exclusivas a bordo del Ocean Spirit, un magnífico yate Ferretti que representa la cúspide del diseño italiano. Con acabados de madera fina, tecnología de punta y amplias zonas de relajación, este yate garantiza una travesía llena de confort y estilo inigualable.',
      img: '/uploads/ocean_spirit.png'
    },
    'Golden Sun': {
      desc: 'Disfruta de la hora dorada como nunca antes en el Golden Sun, un espectacular yate de la prestigiosa marca Princess. Sus líneas elegantes y grandes ventanales permiten conectar de forma perfecta con el entorno marino. Cuenta con un extenso flybridge ideal para tomar cócteles al atardecer.',
      img: '/uploads/golden_sun.png'
    },
    'Silver Moon': {
      desc: 'Siente la adrenalina y el lujo a bordo del Silver Moon, un yate deportivo Pershing conocido por su impresionante velocidad y diseño aerodinámico. Perfecto para quienes buscan llegar rápidamente a los destinos más remotos sin sacrificar un milímetro de sofisticación.',
      img: '/uploads/silver_moon.png'
    },
    'Emerald Wave': {
      desc: 'El Emerald Wave, un superyate firmado por Benetti, redefine la palabra "majestuoso". Diseñado para largas travesías en total lujo, ofrece comodidades de resort de cinco estrellas, incluyendo jacuzzi en cubierta, estabilizadores de última generación y un equipo atento a cada uno de tus deseos.',
      img: '/uploads/emerald_wave.png'
    },
    'Royal Explorer': {
      desc: 'Llega más lejos con el Royal Explorer, una obra maestra de Sanlorenzo creada para la exploración sin límites. Combina capacidades de navegación oceánica con interiores ultramodernos y espaciosos. Ya sea en bahías escondidas o mar abierto, su rendimiento y estabilidad son insuperables.',
      img: '/uploads/royal_explorer.png'
    },
    'Majestic Star': {
      desc: 'Experimenta la legendaria elegancia de la náutica con el Majestic Star. Este yate Riva es la personificación del lujo clásico fusionado con tecnología moderna. Sus impecables detalles artesanales y su desempeño ágil lo convierten en la joya indiscutible de cualquier marina.',
      img: '/uploads/majestic_star.png'
    },
    'Ocean Voyager': {
      desc: 'Explora horizontes infinitos con el Ocean Voyager, un superyate Azimut diseñado para el verdadero disfrute al aire libre. Sus múltiples cubiertas proporcionan espacios infinitos para el entretenimiento, convirtiéndolo en la elección predilecta para celebrar la vida en altamar.',
      img: '/uploads/ocean_voyager.png'
    }
  };

  for (const yacht of yachts) {
    if (updates[yacht.name]) {
      await prisma.yacht.update({
        where: { id: yacht.id },
        data: {
          description_long: updates[yacht.name].desc,
          gallery: [updates[yacht.name].img]
        }
      });
      console.log(`Updated ${yacht.name}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
