import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    const hotelId = searchParams.get('hotelId');
    const userId = searchParams.get('userId');

    if (!packageId && !hotelId && !userId) {
        return NextResponse.json({ success: false, error: 'Package ID, Hotel ID, or User ID required' }, { status: 400 });
    }

    try {
        let targetUserId = null;

        if (userId) {
            targetUserId = Number(userId);
        } else if (packageId) {
            const pkg = await prisma.package.findUnique({
                where: { id: Number(packageId) },
                select: { userId: true }
            });
            if (pkg) targetUserId = pkg.userId;
        } else if (hotelId) {
            const hotel = await prisma.hotel.findUnique({
                where: { id: Number(hotelId) },
                select: { userId: true }
            });
            if (hotel) targetUserId = hotel.userId;
        }

        if (!targetUserId) {
            return NextResponse.json({ success: false, error: 'Target or owner not found' }, { status: 404 });
        }

        const settings = await prisma.gatewaySettings.findUnique({
            where: { userId: targetUserId }
        });

        if (!settings) {
            return NextResponse.json({ success: true, data: { activeGateways: [] } });
        }

        return NextResponse.json({
            success: true,
            data: {
                activeGateways: settings.activeGateways,
                stripePublicKey: settings.activeGateways.includes('stripe') ? settings.stripePublicKey : null,
                paypalClientId: settings.activeGateways.includes('paypal') ? settings.paypalClientId : null
            }
        });
    } catch (error) {
        console.error('Error fetching checkout config:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
