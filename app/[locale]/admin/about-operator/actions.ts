'use server';

import { getLocalDB, writeLocalDB } from '@/lib/db-fallback';
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
    const username = cookieStore.get('user_login')?.value || 'Carlos';
    const localDB = getLocalDB();
    const localUser = localDB.userOverrides.find(u => u.username.toLowerCase() === username.toLowerCase());

    return {
        id: localUser?.id || 3,
        username: username.toLowerCase(),
        role: localUser?.role || 'OPERATOR',
        name: localUser?.name || 'Carlos Mendoza'
    };
}

// 1. Fetch active individual operator profile
export async function getOperatorAboutUsContentAction() {
    const activeUser = await getSessionUser();
    const db = getLocalDB();
    if (!db.operatorProfiles) {
        db.operatorProfiles = [];
    }
    
    let profile = db.operatorProfiles.find(p => p.username.toLowerCase() === activeUser.username.toLowerCase());
    
    if (!profile) {
        profile = {
            id: Date.now(),
            userId: activeUser.id,
            username: activeUser.username,
            name: activeUser.name,
            slug: activeUser.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, ''),
            status: 'PUBLISHED',
            version: 1,
            updatedAt: new Date().toISOString(),
            specialty: 'Especialista VIP',
            yearsExperience: 5,
            bio: '<p>Hola, bienvenido a mi perfil oficial de operador certificado.</p>'
        };
        writeLocalDB(d => {
            if (!d.operatorProfiles) d.operatorProfiles = [];
            d.operatorProfiles.push(profile!);
        });
    }
    
    return { success: true, data: profile };
}

// 2. Save Operator specific profile (Operator)
export async function saveOperatorAboutUsContentAction(params: any) {
    const activeUser = await getSessionUser();

    // Guard: ADMIN or OPERATOR
    if (activeUser.role !== 'ADMIN' && activeUser.role !== 'SUPER_ADMIN' && activeUser.role !== 'OPERATOR' && activeUser.username.toLowerCase() !== 'admin') {
        throw new Error('No autorizado.');
    }

    let savedProfile: any = null;
    let oldProfile: any = null;

    writeLocalDB((db) => {
        if (!db.operatorProfiles) db.operatorProfiles = [];
        const index = db.operatorProfiles.findIndex(p => p.username.toLowerCase() === activeUser.username.toLowerCase());
        
        if (index === -1) {
            throw new Error('Perfil no encontrado para guardar.');
        }

        oldProfile = { ...db.operatorProfiles[index] };
        const nextVersion = oldProfile.version + 1;

        // Apply profile updates
        savedProfile = {
            ...oldProfile,
            ...params,
            version: nextVersion,
            updatedAt: new Date().toISOString()
        };

        db.operatorProfiles[index] = savedProfile;
    });

    // Log the event in Auditoría General
    await logAuditEvent({
        userId: activeUser.id,
        username: activeUser.username,
        role: activeUser.role,
        actionType: 'MODERACION_PERFIL_OPERADOR',
        module: 'QUIENES_SOMOS',
        result: 'SUCCESS',
        beforeData: oldProfile,
        afterData: savedProfile,
        details: `El operador "${activeUser.username}" actualizó sus contenidos de perfil público (Versión #${savedProfile!.version}).`
    });

    return { success: true, data: savedProfile };
}
