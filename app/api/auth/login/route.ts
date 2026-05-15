import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Try to find user with case-insensitive match if possible, 
        // or just find first and check manually
        const user = await prisma.user.findFirst({
            where: { 
                username: {
                    equals: username,
                    mode: 'insensitive' 
                }
            },
        });

        if (!user) {
            console.error(`Login attempt failed: User "${username}" not found.`);
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        if (hashedPassword === user.password) {
            // Set session cookie (Simplified for demo)
            const cookieStore = await cookies();
            cookieStore.set('session', 'admin_session_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });
            cookieStore.set('user_login', user.username, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });
            cookieStore.set('username', user.name || user.username, {
                httpOnly: false, // readable by client
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    } catch (error: unknown) {
        console.error('CRITICAL: Login error:', error);
        return NextResponse.json({
            error: 'Error de conexión con la base de datos',
            message: 'No se pudo establecer comunicación con el servidor de base de datos.'
        }, { status: 500 });
    }
}
