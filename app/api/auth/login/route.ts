import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        let user = null;
        let isFallback = false;

        try {
            // Try to find user by email or username in Prisma
            user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: { equals: username, mode: 'insensitive' } },
                        { email: { equals: username, mode: 'insensitive' } }
                    ]
                },
            });
        } catch (dbError) {
            console.warn('[-] Database connection failed during login, using local memory fallback:', dbError);
            isFallback = true;
            
            // Check fallback users
            const fallbackUsers = [
                { id: 1, username: 'Admin', name: 'System Administrator', role: 'ADMIN', password: '@dmin' },
                { id: 2, username: 'Juan', name: 'Juan Perez', role: 'USER', password: '@dmin' },
                { id: 3, username: 'Carlos', name: 'Carlos Mendoza', role: 'OPERATOR', password: '@dmin' },
                { id: 4, username: 'Ana', name: 'Ana Gomez', role: 'AUDITOR', password: '@dmin' },
                { id: 5, username: 'Livan', name: 'Livan Jorrin Valdes', role: 'OPERATOR', password: '@dmin' }
            ];

            const foundFallback = fallbackUsers.find(
                u => u.username.toLowerCase() === username.toLowerCase()
            );

            if (foundFallback) {
                const hashedPassword = crypto.createHash('sha256').update(foundFallback.password).digest('hex');
                user = {
                    id: foundFallback.id,
                    username: foundFallback.username,
                    password: hashedPassword,
                    role: foundFallback.role,
                    name: foundFallback.name,
                    status: 'ACTIVO',
                    isDeleted: false
                };
            }
        }

        if (!user) {
            console.error(`Login attempt failed: User "${username}" not found.`);
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        if (hashedPassword === user.password) {
            // Set session cookie
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
            cookieStore.set('user_role', user.role, {
                httpOnly: false, // readable by client
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

            return NextResponse.json({ success: true, role: user.role });
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
