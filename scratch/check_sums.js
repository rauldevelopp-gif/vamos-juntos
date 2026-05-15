const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBasePriceSum() {
    try {
        const result = await prisma.packageReservation.aggregate({
            _sum: {
                basePrice: true,
                serviceFee: true,
                totalPrice: true
            }
        });

        console.log('--- Resumen de Base de Datos ---');
        console.log(`Suma de basePrice:  $${result._sum.basePrice || 0}`);
        console.log(`Suma de serviceFee: $${result._sum.serviceFee || 0}`);
        console.log(`Suma de totalPrice: $${result._sum.totalPrice || 0}`);
        console.log('-------------------------------');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkBasePriceSum();
