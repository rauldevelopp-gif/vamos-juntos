import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session');
        const userLogin = cookieStore.get('user_login')?.value;

        if (!session || !userLogin) {
            return null;
        }

        const user = await prisma.user.findFirst({
            where: {
                username: {
                    equals: userLogin,
                    mode: 'insensitive'
                }
            }
        });

        return user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('No autorizado');
    }
    return user;
}
