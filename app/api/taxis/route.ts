import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const taxis = await prisma.taxi.findMany({
            include: { driver: true }
        });
        return NextResponse.json(taxis);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch taxis' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const taxi = await prisma.taxi.create({
            data: {
                type: body.type,
                capacity: parseInt(body.capacity),
                basePrice: parseFloat(body.basePrice),
                driverId: parseInt(body.driverId),
                availability: body.availability ?? true
            }
        });
        return NextResponse.json(taxi);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create taxi' }, { status: 500 });
    }
}
