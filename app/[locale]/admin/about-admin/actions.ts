'use server';

import { getLocalDB, writeLocalDB, LocalAboutUsContent } from '@/lib/db-fallback';
import { logAuditEvent } from '@/lib/audit';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

// Helper to get active user context
async function getSessionUser() {
    try {
        const user = await getCurrentUser();
        if (user) return user;
    } catch (e) {}

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

// 1. Fetch current active content
export async function getAboutUsContentAction() {
    const db = getLocalDB();
    return { success: true, data: db.aboutUs };
}

// 2. Fetch all saved versions
export async function getAboutUsVersionsAction() {
    const db = getLocalDB();
    return { success: true, data: db.aboutUsVersions || [] };
}

// 3. Save new content version (Admin)
export async function saveAboutUsContentAction(newContent: Omit<LocalAboutUsContent, 'version' | 'updatedAt' | 'updatedBy'>) {
    const adminUser = await getSessionUser();
    
    // Auth guard
    if (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN' && adminUser.username.toLowerCase() !== 'admin') {
        throw new Error('No autorizado. Rol de administrador requerido.');
    }

    let savedContent: LocalAboutUsContent | null = null;
    let oldContent: LocalAboutUsContent | null = null;

    writeLocalDB((db) => {
        oldContent = { ...db.aboutUs };
        const nextVersion = db.aboutUs.version + 1;
        
        savedContent = {
            ...newContent,
            version: nextVersion,
            updatedAt: new Date().toISOString(),
            updatedBy: adminUser.username
        };

        db.aboutUs = savedContent;
        if (!db.aboutUsVersions) db.aboutUsVersions = [];
        db.aboutUsVersions.push(savedContent);
    });

    // Log the event
    await logAuditEvent({
        userId: adminUser.id,
        username: adminUser.username,
        role: adminUser.role,
        actionType: 'CAMBIO_QUIENES_SOMOS',
        module: 'QUIENES_SOMOS',
        result: 'SUCCESS',
        beforeData: oldContent,
        afterData: savedContent,
        details: `El administrador actualizó los contenidos corporativos de "Quiénes Somos" a la versión #${savedContent!.version}.`
    });

    return { success: true, data: savedContent };
}

// 4. Restore a specific version
export async function restoreAboutUsVersionAction(versionNumber: number) {
    const adminUser = await getSessionUser();

    // Auth guard
    if (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN' && adminUser.username.toLowerCase() !== 'admin') {
        throw new Error('No autorizado.');
    }

    let restoredContent: LocalAboutUsContent | null = null;
    let oldContent: LocalAboutUsContent | null = null;

    writeLocalDB((db) => {
        oldContent = { ...db.aboutUs };
        const versionToRestore = db.aboutUsVersions.find(v => v.version === versionNumber);
        
        if (!versionToRestore) {
            throw new Error('Versión no encontrada.');
        }

        const nextVersion = db.aboutUs.version + 1;
        restoredContent = {
            ...versionToRestore,
            version: nextVersion,
            updatedAt: new Date().toISOString(),
            updatedBy: `${adminUser.username} (Restaurado v${versionNumber})`
        };

        db.aboutUs = restoredContent;
        db.aboutUsVersions.push(restoredContent);
    });

    await logAuditEvent({
        userId: adminUser.id,
        username: adminUser.username,
        role: adminUser.role,
        actionType: 'RESTAURAR_VERSION_QUIENES_SOMOS',
        module: 'QUIENES_SOMOS',
        result: 'SUCCESS',
        beforeData: oldContent,
        afterData: restoredContent,
        details: `El administrador restauró la versión de contenidos de "Quiénes Somos" a partir de la versión anterior #${versionNumber}.`
    });

    return { success: true, data: restoredContent };
}
