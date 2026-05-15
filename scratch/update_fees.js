const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLegacyReservations() {
    try {
        const reservations = await prisma.packageReservation.findMany({
            where: {
                serviceFee: 0
            }
        });

        console.log(`Found ${reservations.length} legacy reservations to update.`);

        for (const res of reservations) {
            const basePrice = res.totalPrice / 1.05;
            const feeAmount = res.totalPrice - basePrice;

            await prisma.packageReservation.update({
                where: { id: res.id },
                data: {
                    basePrice: basePrice,
                    serviceFee: feeAmount
                }
            });
        }

        console.log('Update complete.');
    } catch (error) {
        console.error('Error updating reservations:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateLegacyReservations();
