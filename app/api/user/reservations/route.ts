import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const packages = await prisma.packageReservation.findMany({
            where: { customerId: user.id },
            include: { package: true },
            orderBy: { createdAt: 'desc' }
        });

        const hotels = await prisma.hotelReservation.findMany({
            where: { customerId: user.id },
            include: { hotel: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: {
                packages,
                hotels
            }
        });
    } catch (error) {
        console.error('Error fetching user reservations:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
