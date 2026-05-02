import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const yachts = await prisma.yacht.findMany();
        return NextResponse.json(yachts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch yachts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const yacht = await prisma.yacht.create({
            data: {
                name: body.name,
                capacity: parseInt(body.capacity),
                hourlyPrice: parseFloat(body.hourlyPrice),
                availability: body.availability ?? true
            }
        });
        return NextResponse.json(yacht);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create yacht' }, { status: 500 });
    }
}
