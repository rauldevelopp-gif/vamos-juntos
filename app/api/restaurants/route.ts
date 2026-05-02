import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const restaurants = await prisma.restaurant.findMany();
        return NextResponse.json(restaurants);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const restaurant = await prisma.restaurant.create({
            data: {
                name: body.name,
                type: body.type,
                location: body.location,
                rating: parseFloat(body.rating),
                menu: body.menu
            }
        });
        return NextResponse.json(restaurant);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
    }
}
