import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, name, password, locatorCode } = await request.json();

        if (!email || !password || !locatorCode) {
            return NextResponse.json({ success: false, error: 'Faltan datos obligatorios' }, { status: 400 });
        }

        // 1. Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (user) {
            return NextResponse.json({ success: false, error: 'Ya existe una cuenta con este correo. Por favor, inicia sesión.' }, { status: 400 });
        }

        // 2. Hash password and create user using sha256 to match login system
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        user = await prisma.user.create({
            data: {
                username: email.split('@')[0] + Math.floor(Math.random() * 1000), // Generate unique username
                email,
                name: name || 'Usuario',
                password: hashedPassword,
                role: 'USER',
            }
        });

        // 3. Link reservation to the new user based on locatorCode
        // It could be a package or hotel reservation, we try both
        const pkgRes = await prisma.packageReservation.findUnique({ where: { locatorCode } });
        if (pkgRes) {
            await prisma.packageReservation.update({
                where: { id: pkgRes.id },
                data: { customerId: user.id }
            });
        }

        const hotelRes = await prisma.hotelReservation.findUnique({ where: { locatorCode } });
        if (hotelRes) {
            await prisma.hotelReservation.update({
                where: { id: hotelRes.id },
                data: { customerId: user.id }
            });
        }

        // 4. Log the user in (matching existing auth system)
        cookies().set('user_login', user.username, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        cookies().set('session', Math.random().toString(36).substring(2), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        cookies().set('user_role', user.role, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });

        return NextResponse.json({ success: true, data: { id: user.id, name: user.name } });

    } catch (error: any) {
        console.error('Account claim error:', error);
        return NextResponse.json({ success: false, error: 'Error al crear la cuenta' }, { status: 500 });
    }
}
