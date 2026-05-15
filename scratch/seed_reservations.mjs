import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const userId = 2;
    
    // Find first package of user 2
    const pkg = await prisma.package.findFirst({
        where: { userId }
    });

    if (!pkg) {
        console.error('No se encontró ningún paquete para el usuario con ID 2');
        return;
    }

    const customers = [
        { name: 'Juan Pérez', email: 'juan@example.com', phone: '+123456789', country: 'España' },
        { name: 'Maria Garcia', email: 'maria@example.com', phone: '+987654321', country: 'Mexico' },
        { name: 'John Doe', email: 'john@example.com', phone: '+111222333', country: 'USA' },
        { name: 'Alice Smith', email: 'alice@example.com', phone: '+444555666', country: 'Canada' },
        { name: 'Roberto Silva', email: 'roberto@example.com', phone: '+555666777', country: 'Brasil' },
        { name: 'Elena Rossi', email: 'elena@example.com', phone: '+333444555', country: 'Italia' },
        { name: 'Pierre Dubois', email: 'pierre@example.com', phone: '+222333444', country: 'Francia' },
        { name: 'Hans Müller', email: 'hans@example.com', phone: '+666777888', country: 'Alemania' },
        { name: 'Yuki Tanaka', email: 'yuki@example.com', phone: '+777888999', country: 'Japón' },
        { name: 'Carlos Rodriguez', email: 'carlos@example.com', phone: '+123123123', country: 'Colombia' }
    ];

    const reservations = [];
    const baseDate = new Date();

    for (let i = 0; i < 20; i++) {
        const customer = customers[i % customers.length];
        const resDate = new Date(baseDate);
        resDate.setDate(baseDate.getDate() + (i - 10)); // From 10 days ago to 10 days from now
        
        const dateStr = resDate.toISOString().split('T')[0];
        
        reservations.push({
            packageId: pkg.id,
            userId: userId,
            customerName: customer.name + ' ' + (i + 1),
            customerEmail: customer.email,
            customerPhone: customer.phone,
            customerCountry: customer.country,
            date: dateStr,
            time: '09:00',
            passengers: Math.floor(Math.random() * 4) + 1,
            totalPrice: pkg.price * (Math.floor(Math.random() * 4) + 1),
            status: i % 5 === 0 ? 'Pendiente' : 'Confirmado',
            notes: 'Reserva de prueba ' + (i + 1)
        });
    }

    console.log(`Generando 20 reservas para el paquete ID: ${pkg.id}...`);

    for (const res of reservations) {
        await prisma.packageReservation.create({
            data: res
        });
    }

    console.log('¡Reservas generadas con éxito!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
