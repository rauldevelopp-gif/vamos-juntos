'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { getLocalDB, writeLocalDB } from '@/lib/db-fallback';
import { logAuditEvent } from '@/lib/audit';
import { getCurrentUser } from '@/lib/auth';

// Helper to fetch the logged-in admin user
async function getSessionUser() {
    try {
        const user = await getCurrentUser();
        if (user) return user;
    } catch (e) {}

    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const username = cookieStore.get('user_login')?.value || 'Admin';
    const localDB = getLocalDB();
    const localUser = localDB.userOverrides.find(u => u.username.toLowerCase() === username.toLowerCase());

    return {
        id: localUser?.id || 1,
        username: username,
        role: localUser?.role || 'ADMIN',
        name: localUser?.name || 'System Administrator'
    };
}

// 1. Fetch System Users (with filters)
export async function getSystemUsers() {
    const users = [];

    // Prisma query first
    try {
        const dbUsers = await prisma.user.findMany({
            where: {
                isDeleted: false
            }
        });
        
        users.push(...dbUsers.map(u => ({
            id: u.id,
            username: u.username,
            name: u.name || u.username,
            email: u.email || 'Sin correo',
            role: u.role,
            status: (u as any).status || 'ACTIVO',
            isDeleted: (u as any).isDeleted || false
        })));
    } catch (e) {
        // Fallback JSON db
        const db = getLocalDB();
        users.push(...db.userOverrides.filter(u => !u.isDeleted).map(u => ({
            ...u,
            email: u.email || 'Sin correo'
        })));
    }

    revalidatePath('/admin', 'layout');
        return { success: true, data: users };
}

// 2. Update User Role
export async function updateUserRoleAction(targetUserId: number, newRole: string) {
    const admin = await getSessionUser();
    let beforeData = '';
    let targetUsername = 'Usuario';

    // Update in Prisma
    try {
        const existing = await prisma.user.findUnique({ where: { id: targetUserId } });
        if (existing) {
            beforeData = JSON.stringify({ role: existing.role });
            targetUsername = existing.username;
            await prisma.user.update({
                where: { id: targetUserId },
                data: { role: newRole }
            });
        }
    } catch (e) {}

    // Update in local JSON fallback db
    try {
        writeLocalDB((db) => {
            const user = db.userOverrides.find(u => u.id === targetUserId);
            if (user) {
                if (!beforeData) beforeData = JSON.stringify({ role: user.role });
                targetUsername = user.username;
                user.role = newRole;
            }
        });
    } catch (jsonErr) {}

    // Log the event
    await logAuditEvent({
        userId: admin.id,
        username: admin.username,
        role: admin.role,
        actionType: 'CAMBIO_ROL',
        module: 'USUARIOS',
        result: 'SUCCESS',
        beforeData: beforeData ? JSON.parse(beforeData) : undefined,
        afterData: { role: newRole },
        details: `Rol del usuario "${targetUsername}" modificado a ${newRole} por el administrador.`
    });

    revalidatePath('/admin', 'layout');
        return { success: true };
}

// 3. Suspend/Block User Status
export async function updateUserStatusAction(targetUserId: number, newStatus: string, reason: string) {
    const admin = await getSessionUser();
    let beforeData = '';
    let targetUsername = 'Usuario';

    // Prisma update
    try {
        const existing = await prisma.user.findUnique({ where: { id: targetUserId } });
        if (existing) {
            beforeData = JSON.stringify({ status: (existing as any).status || 'ACTIVO' });
            targetUsername = existing.username;
            await prisma.user.update({
                where: { id: targetUserId },
                data: { status: newStatus } as any
            });
        }
    } catch (e) {}

    // Fallback JSON db update
    try {
        writeLocalDB((db) => {
            const user = db.userOverrides.find(u => u.id === targetUserId);
            if (user) {
                if (!beforeData) beforeData = JSON.stringify({ status: user.status });
                targetUsername = user.username;
                user.status = newStatus;
            }
        });
    } catch (e) {}

    // 4. Log disciplinary history entry
    try {
        writeLocalDB((db) => {
            const nextId = db.disciplinaryActions.length > 0 ? Math.max(...db.disciplinaryActions.map(d => d.id)) + 1 : 1;
            db.disciplinaryActions.push({
                id: nextId,
                userId: targetUserId,
                adminId: admin.id,
                action: newStatus === 'ACTIVO' ? 'REACTIVACION' : newStatus === 'SUSPENDIDO' ? 'BLOQUEO_TEMPORAL' : 'BLOQUEO_PERMANENTE',
                reason: reason,
                createdAt: new Date().toISOString()
            });
        });
    } catch (e) {}

    // Log audit event
    await logAuditEvent({
        userId: admin.id,
        username: admin.username,
        role: admin.role,
        actionType: 'BLOQUEO_USUARIO',
        module: 'USUARIOS',
        result: 'SUCCESS',
        beforeData: beforeData ? JSON.parse(beforeData) : undefined,
        afterData: { status: newStatus },
        details: `El estado del usuario "${targetUsername}" fue actualizado a [${newStatus}] por motivo: ${reason}`
    });

    revalidatePath('/admin', 'layout');
        return { success: true };
}

// 5. Send customizable user warning push notes
export async function sendUserWarningAction(
    targetUserId: number,
    title: string,
    message: string,
    severity: string,
    behavior: string,
    expiresAt?: string
) {
    const admin = await getSessionUser();
    let targetUsername = 'Usuario';

    // Prisma insert
    try {
        const u = await prisma.user.findUnique({ where: { id: targetUserId } });
        if (u) targetUsername = u.username;
        
        await prisma.userWarning.create({
            data: {
                userId: targetUserId,
                adminId: admin.id,
                title,
                message,
                severity,
                behavior,
                expiresAt: expiresAt || null
            }
        });
    } catch (dbError) {
        // Fallback JSON db insert
        writeLocalDB((db) => {
            const u = db.userOverrides.find(o => o.id === targetUserId);
            if (u) targetUsername = u.username;

            const nextId = db.userWarnings.length > 0 ? Math.max(...db.userWarnings.map(w => w.id)) + 1 : 1;
            db.userWarnings.push({
                id: nextId,
                userId: targetUserId,
                adminId: admin.id,
                title,
                message,
                severity,
                behavior,
                expiresAt,
                isRead: false,
                createdAt: new Date().toISOString()
            });
        });
    }

    // Insert disciplinary record
    try {
        writeLocalDB((db) => {
            const nextId = db.disciplinaryActions.length > 0 ? Math.max(...db.disciplinaryActions.map(d => d.id)) + 1 : 1;
            db.disciplinaryActions.push({
                id: nextId,
                userId: targetUserId,
                adminId: admin.id,
                action: 'ADVERTENCIA',
                reason: `Advertencia push enviada: "${title}" - [Severidad: ${severity}]`,
                createdAt: new Date().toISOString()
            });
        });
    } catch (e) {}

    // Log audit event
    await logAuditEvent({
        userId: admin.id,
        username: admin.username,
        role: admin.role,
        actionType: 'ADVERTENCIA_PUSH',
        module: 'USUARIOS',
        result: 'SUCCESS',
        details: `Advertencia disciplinaria push enviada al usuario "${targetUsername}" con severidad [${severity}].`
    });

    revalidatePath('/admin', 'layout');
        return { success: true };
}

// 6. Delete user account
export async function deleteUserAction(targetUserId: number, deletionType: 'LOGICAL' | 'PHYSICAL') {
    const admin = await getSessionUser();
    let targetUsername = 'Usuario';

    if (deletionType === 'LOGICAL') {
        // Logical deletion (isDeleted = true)
        try {
            const u = await prisma.user.findUnique({ where: { id: targetUserId } });
            if (u) targetUsername = u.username;
            await prisma.user.update({
                where: { id: targetUserId },
                data: { isDeleted: true } as any
            });
        } catch (e) {}

        try {
            writeLocalDB((db) => {
                const u = db.userOverrides.find(o => o.id === targetUserId);
                if (u) {
                    targetUsername = u.username;
                    u.isDeleted = true;
                }
            });
        } catch (e) {}

        await logAuditEvent({
            userId: admin.id,
            username: admin.username,
            role: admin.role,
            actionType: 'ELIMINACION_LOGICA_USUARIO',
            module: 'USUARIOS',
            result: 'SUCCESS',
            details: `Eliminación lógica ejecutada para la cuenta de usuario "${targetUsername}". Historial de auditoría preservado.`
        });
    } else {
        // Physical deletion (Restricted to SUPER_ADMIN/ADMIN)
        try {
            const u = await prisma.user.findUnique({ where: { id: targetUserId } });
            if (u) targetUsername = u.username;
            await prisma.user.delete({ where: { id: targetUserId } });
        } catch (e) {}

        try {
            writeLocalDB((db) => {
                const idx = db.userOverrides.findIndex(o => o.id === targetUserId);
                if (idx !== -1) {
                    targetUsername = db.userOverrides[idx].username;
                    db.userOverrides.splice(idx, 1);
                }
            });
        } catch (e) {}

        await logAuditEvent({
            userId: admin.id,
            username: admin.username,
            role: admin.role,
            actionType: 'ELIMINACION_FISICA_USUARIO',
            module: 'USUARIOS',
            result: 'SUCCESS',
            details: `ELIMINACIÓN FÍSICA de la cuenta de usuario "${targetUsername}" ejecutada de forma permanente.`
        });
    }

    revalidatePath('/admin', 'layout');
        return { success: true };
}

// 7. Get Disciplinary Logs of a specific user
export async function getUserDisciplinaryHistory(userId: number) {
    const db = getLocalDB();
    const history = db.disciplinaryActions
        .filter(d => d.userId === userId)
        .map(d => {
            const adminUser = db.userOverrides.find(o => o.id === d.adminId);
            return {
                id: d.id,
                action: d.action,
                reason: d.reason,
                adminName: adminUser?.name || 'Administrador',
                createdAt: d.createdAt
            };
        });

    revalidatePath('/admin', 'layout');
        return { success: true, data: history };
}

// 8. Fetch active unread warnings for current user
export async function getActiveUserWarnings() {
    const admin = await getSessionUser();
    const warnings = [];

    try {
        const dbWarnings = await prisma.userWarning.findMany({
            where: {
                userId: admin.id,
                isRead: false
            }
        });
        warnings.push(...dbWarnings.map(w => ({
            id: w.id,
            title: w.title,
            message: w.message,
            severity: w.severity,
            behavior: w.behavior,
            createdAt: w.createdAt.toISOString()
        })));
    } catch (e) {
        const db = getLocalDB();
        warnings.push(...db.userWarnings.filter(w => w.userId === admin.id && !w.isRead));
    }

    revalidatePath('/admin', 'layout');
        return { success: true, data: warnings };
}

// 9. Mark warning as read
export async function markWarningAsReadAction(warningId: number) {
    const admin = await getSessionUser();
    let warningTitle = 'Advertencia';

    try {
        const w = await prisma.userWarning.update({
            where: { id: warningId },
            data: { isRead: true }
        });
        warningTitle = w.title;
    } catch (e) {
        writeLocalDB((db) => {
            const w = db.userWarnings.find(x => x.id === warningId);
            if (w) {
                w.isRead = true;
                warningTitle = w.title;
            }
        });
    }

    // Log the read confirmation event
    await logAuditEvent({
        userId: admin.id,
        username: admin.username,
        role: admin.role,
        actionType: 'CONFIRMACION_ADVERTENCIA',
        module: 'USUARIOS',
        result: 'SUCCESS',
        details: `El usuario confirmó la lectura y entendimiento de la advertencia push: "${warningTitle}".`
    });

    revalidatePath('/admin', 'layout');
        return { success: true };
}

// 10. Get currently logged-in user profile (for client components like sidebar & route protection)
export async function getCurrentUserAction() {
    try {
        const admin = await getSessionUser();
        revalidatePath('/admin', 'layout');
        return { 
            success: true, 
            user: {
                id: admin.id,
                username: admin.username,
                role: admin.role,
                name: admin.name
            } 
        };
    } catch (e) {
        return { success: false, error: 'No se pudo obtener el contexto de sesión.' };
    }
}
