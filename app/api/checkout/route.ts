import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Ensure you set STRIPE_SECRET_KEY in your env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_fallback', {
    apiVersion: '2025-01-27.acacia', // using latest stable or default fallback
});

export async function POST(req: Request) {
    try {
        const { services, reservationId } = await req.json();

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: (services as Array<{ name: string; serviceType: string; price: number }>).map((s) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: s.name,
                        description: s.serviceType,
                    },
                    unit_amount: Math.round(s.price * 100), // Stripe expects cents
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&reservation_id=${reservationId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/packages`,
            metadata: {
                reservationId: reservationId.toString()
            }
        });

        return NextResponse.json({ id: session.id, url: session.url });
    } catch (error: unknown) {
        console.error('Stripe error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
