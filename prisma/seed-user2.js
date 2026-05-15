const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = 2; // vamosjuntos.ci.app@gmail.com

  console.log('Seeding data for user ID 2...');

  // 1. Aeropuertos
  const airport1 = await prisma.airport.upsert({
    where: { iata: 'CUN2' },
    update: {},
    create: {
      name: 'Aeropuerto Privado de Cancún',
      location: 'Cancún, Quintana Roo',
      iata: 'CUN2',
      city: 'Cancún',
      state: 'Quintana Roo',
      status: 'Operativo',
      coordinates: '21.0365, -86.8770',
      userId: userId
    }
  });

  // 2. Hoteles
  const hotel1 = await prisma.hotel.create({
    data: {
      name: 'Nizuc Resort & Spa (VIP)',
      location: 'Punta Nizuc',
      stars: 5,
      city: 'Cancún',
      state: 'Quintana Roo',
      status: 'Disponible',
      coordinates: '21.0345, -86.7801',
      userId: userId
    }
  });

  // Choferes y Taxis
  const driver1 = await prisma.driver.create({
    data: {
      name: 'Carlos Mendoza',
      license: 'LIC-987654',
      phone: '529981234567',
      expiration: '2028-12-31',
      rating: 4.9,
      availability: true,
      userId: userId,
    }
  });

  const taxi1 = await prisma.taxi.upsert({
    where: { plate: 'VIP-002' },
    update: {},
    create: {
      plate: 'VIP-002',
      brand: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2024,
      color: 'Negro',
      type: 'Van Lujo',
      passengers: 12,
      luggage: 10,
      status: 'Disponible',
      userId: userId,
      amenities: ['Wi-Fi', 'Aire Acondicionado', 'Bebidas'],
      driverId: driver1.id
    }
  });

  // 3. Playas
  const beach1 = await prisma.beach.create({
    data: {
      name: 'Playa Delfines',
      type: 'Pública',
      city: 'Cancún',
      state: 'Quintana Roo',
      status: 'Abierta',
      coordinates: '21.0592, -86.7795',
      popularity: 'Alta',
      userId: userId
    }
  });

  // 4. Restaurantes
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Porfirios Cancún',
      cuisine: 'Mexicana Contemporánea',
      city: 'Cancún',
      state: 'Quintana Roo',
      status: 'Abierto',
      coordinates: '21.1147, -86.7644',
      priceRange: '$$$$',
      userId: userId
    }
  });

  // 5. Atracciones
  const attraction1 = await prisma.attraction.create({
    data: {
      name: 'Ruinas Mayas de Tulum',
      category: 'Arqueológica',
      city: 'Tulum',
      state: 'Quintana Roo',
      status: 'Abierto',
      coordinates: '20.2150, -87.4289',
      recommendedTime: '3 Horas',
      userId: userId
    }
  });


  // 7. Yates y Tripulación
  const yacht1 = await prisma.yacht.create({
    data: {
      name: 'Ocean Voyager',
      brand: 'Azimut',
      model: 'Flybridge',
      year: 2022,
      length: '60ft',
      capacity: 15,
      price_day: 3500.00,
      status: 'Disponible',
      location: 'Marina Puerto Cancún',
      coordinates: '21.1619, -86.8245',
      availability: true,
      userId: userId,
      crew: {
        create: [
          { name: 'Capitán Roberto', role: 'Capitán', experience: '15 años', phone: '529987654321', userId: userId },
          { name: 'Ana Torres', role: 'Chef', experience: '8 años', phone: '529987654322', userId: userId }
        ]
      }
    }
  });

  // 8. Paquetes
  const packages = [
    {
      name: 'VIP Riviera Maya Tour',
      description: 'Disfruta de un recorrido de lujo por Tulum y Cancún con transportación VIP y atención personalizada.',
      price: 1200.00,
      status: 'Activo',
      date: '2024-11-20',
      image: '/mexico_luxury_ruins_hero_1778020263723.png',
      start_time: '08:00',
      userId: userId,
      driverId: driver1.id,
      sales: 10,
      items: [
        { type: 'aeropuerto', name: airport1.name },
        { type: 'hotel', name: hotel1.name },
        { type: 'atraccion', name: attraction1.name },
        { type: 'restaurante', name: restaurant1.name }
      ]
    },
    {
      name: 'Día de Yate de Lujo',
      description: 'Un día inolvidable a bordo de un yate Azimut 60ft con chef privado recorriendo Isla Mujeres.',
      price: 3800.00,
      status: 'Activo',
      date: '2024-11-25',
      image: '/gourmet_sunset_cruise_1778014528974.png',
      start_time: '10:00',
      userId: userId,
      driverId: driver1.id,
      sales: 5,
      items: [
        { type: 'yate', name: yacht1.name },
        { type: 'restaurante', name: 'Chef Privado a Bordo' }
      ]
    },
    {
      name: 'Escapada Relax Nizuc',
      description: 'Transporte de lujo desde el aeropuerto al exclusivo Nizuc Resort con acceso a spa.',
      price: 450.00,
      status: 'Activo',
      date: '2024-12-01',
      image: '/hidden_beach_exploration_1778014515971.png',
      start_time: '14:00',
      userId: userId,
      driverId: driver1.id,
      sales: 20,
      items: [
        { type: 'aeropuerto', name: airport1.name },
        { type: 'hotel', name: hotel1.name },
        { type: 'playa', name: beach1.name }
      ]
    },
    {
      name: 'Tour Gastronómico',
      description: 'Descubre los mejores sabores de Cancún con transporte privado.',
      price: 300.00,
      status: 'Activo',
      date: '2024-12-05',
      image: '/mexico_luxury_ruins_hero_1778020263723.png',
      start_time: '19:00',
      userId: userId,
      driverId: driver1.id,
      sales: 8,
      items: [
        { type: 'hotel', name: hotel1.name },
        { type: 'restaurante', name: restaurant1.name }
      ]
    }
  ];

  for (const pkg of packages) {
    await prisma.package.create({ data: pkg });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
