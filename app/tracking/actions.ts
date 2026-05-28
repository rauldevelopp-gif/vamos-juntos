'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function trackReservationAsGuest(email: string, locatorCode: string) {
    try {
        // Try finding a package reservation
        const pkgRes = await prisma.packageReservation.findFirst({
            where: {
                customerEmail: email,
                locatorCode: locatorCode
            },
            include: {
                package: {
                    include: {
                        driver: { select: { name: true, photo: true } },
                    }
                }
            }
        });

        if (pkgRes) {
            return { success: true, type: 'package', data: pkgRes };
        }

        // Try finding a hotel reservation
        const hotelRes = await prisma.hotelReservation.findFirst({
            where: {
                customerEmail: email,
                locatorCode: locatorCode
            },
            include: {
                hotel: true,
                room: true
            }
        });

        if (hotelRes) {
            return { success: true, type: 'hotel', data: hotelRes };
        }

        return { success: false, error: 'No se encontró ninguna reserva con esos datos.' };
    } catch (error) {
        console.error('Tracking Error:', error);
        return { success: false, error: 'Error al consultar la reserva' };
    }
}

export async function getUserReservations() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const pkgRes = await prisma.packageReservation.findMany({
            where: { customerId: user.id },
            include: {
                package: {
                    include: { driver: { select: { name: true, photo: true } } }
                }
            }
        });

        const hotelRes = await prisma.hotelReservation.findMany({
            where: { customerId: user.id },
            include: {
                hotel: true,
                room: true
            }
        });

        return { success: true, packages: pkgRes, hotels: hotelRes };
    } catch (error) {
        console.error('Fetch reservations error:', error);
        return { success: false, error: 'Error al consultar las reservas' };
    }
}
