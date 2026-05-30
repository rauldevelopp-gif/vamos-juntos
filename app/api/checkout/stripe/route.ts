import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { packageId, amount } = body;

        if (!packageId || !amount) {
            return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
        }

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

        if (!settings || !settings.activeGateways.includes('stripe') || !settings.stripeSecretKey) {
            return NextResponse.json({ success: false, error: 'Stripe not configured for this vendor' }, { status: 400 });
        }

        const stripe = new Stripe(settings.stripeSecretKey, {
            apiVersion: '2023-10-16', // or latest
        });

        // Amount must be in cents for Stripe (USD)
        const amountInCents = Math.round(amount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            // In a real app, you would add metadata here (booking details, etc)
        });

        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error: any) {
        console.error('Error creating Stripe intent:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}
