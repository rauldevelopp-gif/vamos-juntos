import { prisma } from '@/lib/prisma';
import { getLocalDB, writeLocalDB } from './db-fallback';

interface AuditParams {
    userId?: number;
    username?: string;
    role?: string;
    ipAddress?: string;
    device?: string;
    browser?: string;
    actionType: string; // e.g. "CREAR_RESERVA", "CANCELAR_RESERVA", "CANCELAR_PAQUETE", "CAMBIO_PRECIO", "LOGIN_FALLIDO", "EXPORTACION_DATOS", "CAMBIO_ROL", "BLOQUEO_USUARIO", "ADVERTENCIA_PUSH"
    module: string;     // e.g. "RESERVAS", "SEGURIDAD", "PAQUETES", "USUARIOS", etc.
    result: string;     // "SUCCESS" or "FAILED"
    tenantId?: string;
    beforeData?: any;
    afterData?: any;
    details?: string;
}

export async function logAuditEvent(params: AuditParams) {
    let createdAudit = null;
    const timestampStr = new Date().toISOString();

    // 1. Try to log to Prisma database
    try {
        createdAudit = await prisma.auditLog.create({
            data: {
                userId: params.userId,
                username: params.username,
                role: params.role,
                ipAddress: params.ipAddress || '127.0.0.1',
                device: params.device || 'Desconocido',
                browser: params.browser || 'Navegador',
                actionType: params.actionType,
                module: params.module,
                result: params.result,
                tenantId: params.tenantId || 'default',
                beforeData: params.beforeData ? JSON.stringify(params.beforeData) : null,
                afterData: params.afterData ? JSON.stringify(params.afterData) : null,
                details: params.details || '',
            }
        });
    } catch (dbError) {
        console.warn('Prisma database is unreachable, writing audit log to local fallback JSON db...');
    }

    // 2. Dual-write/fallback to JSON database
    try {
        writeLocalDB((db) => {
            const nextId = db.auditLogs.length > 0 ? Math.max(...db.auditLogs.map(l => l.id)) + 1 : 1;
            db.auditLogs.push({
                id: nextId,
                userId: params.userId,
                username: params.username,
                role: params.role,
                timestamp: timestampStr,
                ipAddress: params.ipAddress || '127.0.0.1',
                device: params.device || 'Desconocido',
                browser: params.browser || 'Navegador',
                actionType: params.actionType,
                module: params.module,
                result: params.result,
                tenantId: params.tenantId || 'default',
                beforeData: params.beforeData ? JSON.stringify(params.beforeData) : undefined,
                afterData: params.afterData ? JSON.stringify(params.afterData) : undefined,
                details: params.details || '',
            });
        });
    } catch (jsonError) {
        console.error('CRITICAL: Failed to write fallback JSON audit log:', jsonError);
    }

    // 3. Run Anomaly Detection check asynchronously (Prisma first, JSON fallback)
    if (params.userId && params.result === 'SUCCESS') {
        runAnomalyDetection(params.userId, params.actionType, params.username || 'Usuario').catch(err => 
            console.error("Error in anomaly detection run:", err)
        );
    }

    return createdAudit || {
        id: Date.now(),
        userId: params.userId,
        username: params.username,
        role: params.role,
        timestamp: new Date(timestampStr),
        ipAddress: params.ipAddress,
        device: params.device,
        browser: params.browser,
        actionType: params.actionType,
        module: params.module,
        result: params.result,
        tenantId: params.tenantId,
        beforeData: params.beforeData ? JSON.stringify(params.beforeData) : null,
        afterData: params.afterData ? JSON.stringify(params.afterData) : null,
        details: params.details || '',
    };
}

async function runAnomalyDetection(userId: number, actionType: string, username: string) {
    try {
        let recentCancellations = 0;
        let recentExports = 0;
        let recentPriceChanges = 0;
        
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        // 1. Try querying from Prisma
        try {
            if (actionType === 'CANCELAR_RESERVA' || actionType === 'CANCELAR_PAQUETE') {
                recentCancellations = await prisma.auditLog.count({
                    where: {
                        userId,
                        actionType: { in: ['CANCELAR_RESERVA', 'CANCELAR_PAQUETE'] },
                        timestamp: { gte: fiveMinutesAgo }
                    }
                });
            } else if (actionType === 'EXPORTACION_DATOS') {
                recentExports = await prisma.auditLog.count({
                    where: {
                        userId,
                        actionType: 'EXPORTACION_DATOS',
                        timestamp: { gte: oneHourAgo }
                    }
                });
            } else if (actionType === 'CAMBIO_PRECIO') {
                recentPriceChanges = await prisma.auditLog.count({
                    where: {
                        userId,
                        actionType: 'CAMBIO_PRECIO',
                        timestamp: { gte: tenMinutesAgo }
                    }
                });
            }
        } catch (dbError) {
            // Prisma failed, query from local fallback JSON database
            const db = getLocalDB();
            
            if (actionType === 'CANCELAR_RESERVA' || actionType === 'CANCELAR_PAQUETE') {
                recentCancellations = db.auditLogs.filter(l => 
                    l.userId === userId && 
                    ['CANCELAR_RESERVA', 'CANCELAR_PAQUETE'].includes(l.actionType) && 
                    new Date(l.timestamp).getTime() >= fiveMinutesAgo.getTime()
                ).length;
            } else if (actionType === 'EXPORTACION_DATOS') {
                recentExports = db.auditLogs.filter(l => 
                    l.userId === userId && 
                    l.actionType === 'EXPORTACION_DATOS' && 
                    new Date(l.timestamp).getTime() >= oneHourAgo.getTime()
                ).length;
            } else if (actionType === 'CAMBIO_PRECIO') {
                recentPriceChanges = db.auditLogs.filter(l => 
                    l.userId === userId && 
                    l.actionType === 'CAMBIO_PRECIO' && 
                    new Date(l.timestamp).getTime() >= tenMinutesAgo.getTime()
                ).length;
            }
        }

        // 2. Anomaly Evaluation
        let triggeredIncident = null;

        if (recentCancellations >= 3) {
            triggeredIncident = {
                title: 'Detección de Cancelaciones Masivas',
                description: `El usuario ${username} realizó ${recentCancellations} cancelaciones de reservas/paquetes en los últimos 5 minutos.`,
                severity: 'CRITICO'
            };
        } else if (recentExports >= 5) {
            triggeredIncident = {
                title: 'Detección de Exportaciones Excesivas',
                description: `El usuario ${username} realizó ${recentExports} exportaciones de bases de datos/logs en la última hora.`,
                severity: 'ALTO'
            };
        } else if (recentPriceChanges >= 10) {
            triggeredIncident = {
                title: 'Modificaciones Masivas de Precios',
                description: `El usuario ${username} realizó ${recentPriceChanges} cambios de tarifas de hoteles/paquetes en los últimos 10 minutos.`,
                severity: 'ALTO'
            };
        }

        if (triggeredIncident) {
            // 3. Write incident to Prisma
            try {
                await prisma.incident.create({
                    data: {
                        userId,
                        title: triggeredIncident.title,
                        description: triggeredIncident.description,
                        severity: triggeredIncident.severity,
                        status: 'ABIERTO'
                    }
                });
            } catch (dbError) {
                // Prisma failed, write incident to local JSON db
                writeLocalDB((db) => {
                    const nextId = db.incidents.length > 0 ? Math.max(...db.incidents.map(i => i.id)) + 1 : 1;
                    db.incidents.push({
                        id: nextId,
                        userId,
                        title: triggeredIncident!.title,
                        description: triggeredIncident!.description,
                        severity: triggeredIncident!.severity,
                        status: 'ABIERTO',
                        createdAt: new Date().toISOString()
                    });
                });
            }
        }
    } catch (e) {
        console.error("Error running anomaly detection logic:", e);
    }
}
