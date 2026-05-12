import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const places = await prisma.place.findMany();
        return NextResponse.json(places);
    } catch (error) {
        console.error('Places API error:', error);
        return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const place = await prisma.place.create({
            data: {
                name: body.name,
                category: body.category
            }
        });
        return NextResponse.json(place);
    } catch (error) {
        console.error('Places API error:', error);
        return NextResponse.json({ error: 'Failed to create place' }, { status: 500 });
    }
}
