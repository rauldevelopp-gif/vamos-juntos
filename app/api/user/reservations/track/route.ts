import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const locatorCode = searchParams.get('locatorCode');

        if (!email || !locatorCode) {
            return NextResponse.json({ success: false, error: 'Email and locator code are required' }, { status: 400 });
        }

        // Search in Package Reservations
        const pkgRes = await prisma.packageReservation.findFirst({
            where: { 
                customerEmail: email, 
                locatorCode: locatorCode 
            },
            include: { package: true }
        });

        if (pkgRes) {
            return NextResponse.json({
                success: true,
                data: {
                    type: 'package',
                    data: pkgRes
                }
            });
        }

        // Search in Hotel Reservations
        const hotelRes = await prisma.hotelReservation.findFirst({
            where: { 
                customerEmail: email, 
                locatorCode: locatorCode 
            },
            include: { hotel: true }
        });

        if (hotelRes) {
            return NextResponse.json({
                success: true,
                data: {
                    type: 'hotel',
                    data: hotelRes
                }
            });
        }

        return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 });

    } catch (error) {
        console.error('Error tracking reservation:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
