import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { currentPassword, newPassword } = await request.json();
        
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const session = cookieStore.get('session');
        const userLogin = cookieStore.get('user_login')?.value;

        if (!session || !userLogin) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Find the user by userLogin (which stores the unique username/email)
        const user = await prisma.user.findFirst({
            where: { 
                username: {
                    equals: userLogin,
                    mode: 'insensitive' 
                }
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const currentHashed = crypto.createHash('sha256').update(currentPassword).digest('hex');

        if (currentHashed !== user.password) {
            return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 401 });
        }

        const newHashed = crypto.createHash('sha256').update(newPassword).digest('hex');

        await prisma.user.update({
            where: { id: user.id },
            data: { password: newHashed }
        });

        return NextResponse.json({ success: true, message: 'Contraseña actualizada exitosamente' });
    } catch (error: unknown) {
        console.error('Password update error:', error);
        return NextResponse.json({
            error: 'Error interno del servidor',
        }, { status: 500 });
    }
}
