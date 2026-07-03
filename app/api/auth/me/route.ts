import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getLocalDB, writeLocalDB } from '@/lib/db-fallback';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';


export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Try Prisma via getCurrentUser (uses raw SQL internally)
        const user = await getCurrentUser();

        if (user) {
            // Check local overrides (status, role, isDeleted) from fallback DB
            const localDB = getLocalDB();
            const override = localDB.userOverrides.find(u => u.username.toLowerCase() === user.username.toLowerCase());

            return NextResponse.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: override ? override.role : user.role,
                    status: override ? override.status : 'ACTIVO',
                    isDeleted: override ? override.isDeleted : false,
                }
            });
        }
    } catch (e) {
        console.warn('getCurrentUser failed, attempting cookie-based fallback...');
    }

    // 2. Cookie-based fallback — works even when DB is unreachable
    try {
        const cookieStore = await cookies();
        const userLogin = cookieStore.get('user_login')?.value;
        const userRole = cookieStore.get('user_role')?.value;
        const sessionCookie = cookieStore.get('session')?.value;

        if (userLogin && sessionCookie) {
            // Check local overrides first
            const localDB = getLocalDB();
            let localUser = localDB.userOverrides.find(u => u.username.toLowerCase() === userLogin.toLowerCase());

            // Auto-create entry in fallback DB if not present
            if (!localUser) {
                const role = userRole || (userLogin.toLowerCase() === 'admin' ? 'ADMIN' : 'USER');
                writeLocalDB((db) => {
                    const nextId = db.userOverrides.length > 0 ? Math.max(...db.userOverrides.map(u => u.id)) + 1 : 1;
                    db.userOverrides.push({
                        id: nextId,
                        username: userLogin,
                        name: userLogin === 'Admin' ? 'System Administrator' : userLogin,
                        role,
                        status: 'ACTIVO',
                        isDeleted: false
                    });
                });
                const updatedDB = getLocalDB();
                localUser = updatedDB.userOverrides.find(u => u.username.toLowerCase() === userLogin.toLowerCase());
            }

            if (localUser) {
                return NextResponse.json({
                    success: true,
                    user: {
                        id: localUser.id,
                        username: localUser.username,
                        name: localUser.name || localUser.username,
                        role: localUser.role,
                        status: localUser.status,
                        isDeleted: localUser.isDeleted
                    }
                });
            }
        }
    } catch (cookieErr) {
        console.error('Error reading session cookies in /api/auth/me:', cookieErr);
    }

    return NextResponse.json({ success: false, error: 'Not logged in' }, { status: 401 });
}
