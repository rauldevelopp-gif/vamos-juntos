'use server';

import prisma from '@/lib/db';

export async function getPublicHotels() {
    try {
        const hotels = await prisma.hotel.findMany({
            where: { status: 'Disponible' },
            orderBy: { name: 'asc' },
            include: {
                rooms: {
                    where: { status: 'Activa' },
                    select: {
                        id: true,
                        type: true,
                        maxCapacity: true,
                        basePrice: true,
                        gallery: true,
                        amenities: true,
                        cancellationPolicy: true,
                        status: true
                    }
                }
            }
        });
        return { success: true, data: hotels };
    } catch (error) {
        console.error('Error fetching public hotels:', error);
        return { success: false, error: 'Error cargando hoteles' };
    }
}

export async function getHotelById(id: number) {
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id },
            include: {
                rooms: {
                    where: { status: 'Activa' }
                },
                user: {
                    select: { name: true, email: true, role: true }
                }
            }
        });
        if (!hotel) return { success: false, error: 'Hotel no encontrado' };
        return { success: true, data: hotel };
    } catch (error) {
        return { success: false, error: 'Error cargando hotel' };
    }
}

export async function createHotelReservation(data: {
    hotelId: number;
    roomId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    totalPrice: number;
    discountCode?: string;
    discountAmount?: number;
}) {
    try {
        const room = await prisma.hotelRoom.findUnique({ 
            where: { id: data.roomId },
            include: { hotel: true }
        });
        if (!room) throw new Error("Room not found");

        // Mark discount code as used if provided
        if (data.discountCode) {
            await prisma.discountCode.updateMany({
                where: { code: data.discountCode, used: false },
                data: { used: true }
            });
        }
 
        const reservation = await prisma.hotelReservation.create({
            data: {
                roomId: data.roomId,
                hotelId: data.hotelId,
                userId: room.hotel.userId,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                checkInDate: data.checkInDate,
                checkOutDate: data.checkOutDate,
                guests: data.guests,
                totalPrice: data.totalPrice,
                discountCode: data.discountCode || null,
                discountAmount: data.discountAmount || null,
                status: 'Confirmado'
            }
        });

        return { success: true, data: reservation };
    } catch (error) {
        console.error('Error creating hotel reservation:', error);
        return { success: false, error: 'Failed to create reservation' };
    }
}


export async function getAllHotelReservations() {
    try {
        const { getCurrentUser } = await import('@/lib/auth');
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

        const reservations = await prisma.hotelReservation.findMany({
            where: whereClause,
            include: {
                hotel: { select: { name: true, city: true } },
                room: { select: { type: true } }
            },
            orderBy: { checkInDate: 'desc' }
        });

        return { success: true, data: reservations };
    } catch (error) {
        console.error('Error fetching hotel reservations:', error);
        return { success: false, error: 'Failed to fetch hotel reservations' };
    }
}
