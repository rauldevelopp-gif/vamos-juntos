import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const reservations = await prisma.reservation.findMany({
            include: {
                services: {
                    include: { taxi: true, yacht: true, place: true, restaurant: true }
                },
                user: true
            }
        });
        return NextResponse.json(reservations);
    } catch (error) {
        console.error('Reservations API error:', error);
        return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Determine user (in a real app this would come from auth context)
        let user = await prisma.user.findUnique({ where: { email: body.email } });
        if (!user) {
            user = await prisma.user.create({ data: { email: body.email } });
        }

        const servicesData = (body.services as Array<{ 
            serviceType: string; 
            taxiId?: number; 
            yachtId?: number; 
            placeId?: number; 
            restaurantId?: number; 
            quantity?: number; 
            price: number 
        }>).map((s) => ({
            serviceType: s.serviceType,
            taxiId: s.taxiId,
            yachtId: s.yachtId,
            placeId: s.placeId,
            restaurantId: s.restaurantId,
            quantity: s.quantity || 1,
            price: s.price
        }));

        const reservation = await prisma.reservation.create({
            data: {
                userId: user.id,
                totalAmount: parseFloat(body.totalAmount),
                status: 'PENDING',
                services: {
                    create: servicesData
                }
            },
            include: { services: true }
        });

        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Reservations API error:', error);
        return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
    }
}
