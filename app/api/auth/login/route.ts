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
            cookies().set('session', 'admin_session_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    } catch (error: any) {
        console.error('CRITICAL: Login error:', error);
        return NextResponse.json({
            error: 'Error de conexión con la base de datos',
            message: error.message
        }, { status: 500 });
    }
}
