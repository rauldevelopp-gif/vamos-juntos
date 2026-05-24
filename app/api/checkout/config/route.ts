import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');

    if (!packageId) {
        return NextResponse.json({ success: false, error: 'Package ID required' }, { status: 400 });
    }

    try {
        const pkg = await prisma.package.findUnique({
            where: { id: Number(packageId) },
            select: { userId: true }
        });

        if (!pkg || !pkg.userId) {
            return NextResponse.json({ success: false, error: 'Package or owner not found' }, { status: 404 });
        }

        const settings = await prisma.gatewaySettings.findUnique({
            where: { userId: pkg.userId }
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
