'use server';

import { prisma } from '@/lib/prisma';
import { getLocalDB, writeLocalDB } from '@/lib/db-fallback';
import { logAuditEvent } from '@/lib/audit';
import { getCurrentUser } from '@/lib/auth';

// Helper to get active user context
async function getSessionUser() {
    try {
        const user = await getCurrentUser();
        if (user) return user;
    } catch (e) {}

    // Fallback to reading mock admin session
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

// 1. Fetch Audit Logs with Filtering
export async function getSuperAuditLogs(filters?: {
    search?: string;
    actionType?: string;
    module?: string;
    userId?: number;
    startDate?: string;
    endDate?: string;
}) {
    const logs = [];

    // Attempt to query from Prisma first
    try {
        const dbLogs = await prisma.auditLog.findMany({
            orderBy: { timestamp: 'desc' }
        });
        
        logs.push(...dbLogs.map(l => ({
            id: l.id,
            userId: l.userId,
            username: l.username || 'Sistema',
            role: l.role || 'USER',
            timestamp: l.timestamp.toISOString(),
            ipAddress: l.ipAddress || '127.0.0.1',
            device: l.device || 'Desconocido',
            browser: l.browser || 'Navegador',
            actionType: l.actionType,
            module: l.module,
            result: l.result,
            tenantId: l.tenantId || 'default',
            beforeData: l.beforeData || undefined,
            afterData: l.afterData || undefined,
            details: l.details || ''
        })));
    } catch (e) {
        // Fallback to JSON database
        const db = getLocalDB();
        logs.push(...db.auditLogs);
    }

    // Apply client filters
    let filtered = [...logs];
    
    if (filters) {
        if (filters.search) {
            const s = filters.search.toLowerCase();
            filtered = filtered.filter(l => 
                (l.username && l.username.toLowerCase().includes(s)) ||
                (l.details && l.details.toLowerCase().includes(s)) ||
                (l.actionType && l.actionType.toLowerCase().includes(s))
            );
        }
        if (filters.actionType && filters.actionType !== 'Todos') {
            filtered = filtered.filter(l => l.actionType === filters.actionType);
        }
        if (filters.module && filters.module !== 'Todos') {
            filtered = filtered.filter(l => l.module === filters.module);
        }
        if (filters.userId) {
            filtered = filtered.filter(l => l.userId === filters.userId);
        }
        if (filters.startDate) {
            const start = new Date(filters.startDate).getTime();
            filtered = filtered.filter(l => new Date(l.timestamp).getTime() >= start);
        }
        if (filters.endDate) {
            const end = new Date(filters.endDate + 'T23:59:59').getTime();
            filtered = filtered.filter(l => new Date(l.timestamp).getTime() <= end);
        }
    }

    // Sort descending by timestamp
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return { success: true, data: filtered };
}

// 2. Fetch Incident Alerts and Disciplinaries
export async function getIncidentsAndAlerts() {
    const incidents = [];
    try {
        const dbIncidents = await prisma.incident.findMany({
            orderBy: { createdAt: 'desc' }
        });
        incidents.push(...dbIncidents.map(i => ({
            id: i.id,
            userId: i.userId,
            title: i.title,
            description: i.description,
            severity: i.severity,
            status: i.status,
            createdAt: i.createdAt.toISOString()
        })));
    } catch (e) {
        const db = getLocalDB();
        incidents.push(...db.incidents);
    }
    return { success: true, data: incidents };
}

// 3. Resolve Incident
export async function resolveIncidentAction(incidentId: number) {
    const currentUser = await getSessionUser();
    
    try {
        await prisma.incident.update({
            where: { id: incidentId },
            data: { status: 'RESUELTO' }
        });
    } catch (e) {
        writeLocalDB((db) => {
            const incident = db.incidents.find(i => i.id === incidentId);
            if (incident) {
                incident.status = 'RESUELTO';
            }
        });
    }

    // Log the resolution action
    await logAuditEvent({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        actionType: 'RESOLVER_INCIDENTE',
        module: 'SEGURIDAD',
        result: 'SUCCESS',
        details: `Incidente ID #${incidentId} marcado como RESUELTO.`
    });

    return { success: true };
}

// 4. Trigger Data Export Log Event (crucial to trigger anomaly detector if user abuses)
export async function triggerExportLogAction() {
    const currentUser = await getSessionUser();
    
    await logAuditEvent({
        userId: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        actionType: 'EXPORTACION_DATOS',
        module: 'AUDITORIA',
        result: 'SUCCESS',
        details: `El administrador exportó el historial completo de auditoría a archivo CSV.`
    });

    return { success: true };
}

// 5. Fetch Technical and System Performance Logs (Simulation with live stats)
export async function getSystemPerformanceLogs() {
    const latencyLogs = [
        { time: '08:00', latency: 45, errorRate: 0.1 },
        { time: '10:00', latency: 85, errorRate: 0.4 },
        { time: '12:00', latency: 120, errorRate: 1.2 },
        { time: '14:00', latency: 95, errorRate: 0.8 },
        { time: '16:00', latency: 60, errorRate: 0.3 },
        { time: '18:00', latency: 110, errorRate: 0.9 },
        { time: '20:00', latency: 155, errorRate: 2.1 },
        { time: '22:00', latency: 50, errorRate: 0.2 }
    ];

    const errorLogs = [
        { id: 'err-1', timestamp: new Date(Date.now() - 600000).toLocaleTimeString(), level: 'CRITICAL', service: 'Stripe Gateway', message: 'Fallo de handshaking TLS al procesar pago: Connection timeout.' },
        { id: 'err-2', timestamp: new Date(Date.now() - 1200000).toLocaleTimeString(), level: 'ERROR', service: 'Prisma Client', message: 'Error P1001: Can\'t reach database server at pooler.supabase.com:5432.' },
        { id: 'err-3', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(), level: 'WARN', service: 'SMTP Mailer', message: 'Reintento de envío de confirmación de correo a client@gmail.com fallido (código 451).' },
        { id: 'err-4', timestamp: new Date(Date.now() - 7200000).toLocaleTimeString(), level: 'ERROR', service: 'Google Maps API', message: 'Quota limit exceeded for Geocoding request on Riviera Maya coordinates.' }
    ];

    return {
        success: true,
        latencyLogs,
        errorLogs,
        systemStatus: {
            cpuUsage: 24,
            memoryUsage: 68,
            activeSockets: 450,
            dbPoolHealthy: false
        }
    };
}
