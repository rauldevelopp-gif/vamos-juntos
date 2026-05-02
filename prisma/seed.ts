import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding initial data...')

    // Drivers
    const driver1 = await prisma.driver.create({
        data: { name: 'Juan Perez', license: 'XY123', phone: '555-0001' }
    })
    const driver2 = await prisma.driver.create({
        data: { name: 'Carlos Gomez', license: 'ZT456', phone: '555-0002' }
    })

    // Taxis
    await prisma.taxi.create({
        data: { type: 'Standard', capacity: 4, basePrice: 50, driverId: driver1.id }
    })
    await prisma.taxi.create({
        data: { type: 'Premium SUV', capacity: 6, basePrice: 100, driverId: driver2.id }
    })

    // Yachts
    await prisma.yacht.create({
        data: { name: 'Ocean Breeze', capacity: 12, hourlyPrice: 300 }
    })
    await prisma.yacht.create({
        data: { name: 'Sea Diamond', capacity: 8, hourlyPrice: 200 }
    })

    // Places
    await prisma.place.createMany({
        data: [
            { name: 'Playa del Sol', category: 'Beach' },
            { name: 'Parque Nacional de Coral', category: 'Park' },
            { name: 'Ruinas Antiguas', category: 'Monument' },
            { name: 'Cenote Azul', category: 'Excursion' }
        ]
    })

    // Restaurants
    await prisma.restaurant.createMany({
        data: [
            { name: 'Mariscos El Faro', type: 'Seafood', location: 'Marina Bay', rating: 4.8 },
            { name: 'La Brasa', type: 'Steakhouse', location: 'Downtown', rating: 4.5 }
        ]
    })

    console.log('Seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
