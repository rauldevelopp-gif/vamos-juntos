const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixReservationsLogic() {
    try {
        // Obtenemos todas las reservaciones
        const reservations = await prisma.packageReservation.findMany();

        console.log(`Corrigiendo ${reservations.length} reservaciones...`);

        for (const res of reservations) {
            // El totalPrice original (ej. 300) debe ser ahora el basePrice
            // Pero como ya corrimos un script antes, el 'basePrice' + 'serviceFee' actual suman el 'totalPrice' original.
            // Para estar seguros, el valor base real es el que el usuario identificó (el total antes de mi error).
            
            // Si el registro fue afectado por mi script anterior, el valor original es res.totalPrice
            // Vamos a restaurar: basePrice = el total que habia antes (que es la suma actual de base+fee si no se ha cambiado nada)
            const originalBase = res.basePrice + res.serviceFee; 
            const newFee = originalBase * 0.05;
            const newTotal = originalBase + newFee;

            await prisma.packageReservation.update({
                where: { id: res.id },
                data: {
                    basePrice: originalBase,
                    serviceFee: newFee,
                    totalPrice: newTotal
                }
            });
        }

        console.log('¡Corrección de base de datos completada!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixReservationsLogic();
