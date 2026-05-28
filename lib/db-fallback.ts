import fs from 'fs';
import path from 'path';

// Locate scratch directory
const SCRATCH_DIR = path.join(process.cwd(), 'scratch');
const DB_JSON_PATH = path.join(SCRATCH_DIR, 'db.json');

// Interface definitions
export interface LocalAuditLog {
    id: number;
    userId?: number;
    username?: string;
    role?: string;
    timestamp: string;
    ipAddress?: string;
    device?: string;
    browser?: string;
    actionType: string;
    module: string;
    result: string;
    tenantId?: string;
    beforeData?: string;
    afterData?: string;
    details?: string;
}

export interface LocalUserWarning {
    id: number;
    userId: number;
    adminId: number;
    title: string;
    message: string;
    severity: string;
    behavior: string;
    expiresAt?: string;
    isRead: boolean;
    createdAt: string;
}

export interface LocalIncident {
    id: number;
    userId: number;
    adminId?: number;
    title: string;
    description: string;
    severity: string;
    status: string;
    createdAt: string;
}

export interface LocalDisciplinaryAction {
    id: number;
    userId: number;
    adminId: number;
    action: string;
    reason: string;
    createdAt: string;
}

export interface LocalUserOverride {
    id: number;
    username: string;
    name?: string;
    role: string;
    status: string;
    isDeleted: boolean;
}

interface LocalDatabase {
    auditLogs: LocalAuditLog[];
    userWarnings: LocalUserWarning[];
    incidents: LocalIncident[];
    disciplinaryActions: LocalDisciplinaryAction[];
    userOverrides: LocalUserOverride[];
}

function initializeDB(): LocalDatabase {
    if (!fs.existsSync(SCRATCH_DIR)) {
        fs.mkdirSync(SCRATCH_DIR, { recursive: true });
    }
    
    if (fs.existsSync(DB_JSON_PATH)) {
        try {
            const data = fs.readFileSync(DB_JSON_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            console.error("Error reading JSON db, resetting:", e);
        }
    }
    
    // Seed with realistic initial data
    const initialDB: LocalDatabase = {
        auditLogs: [
            { id: 1, userId: 1, username: 'Admin', role: 'ADMIN', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), ipAddress: '192.168.1.15', device: 'Windows PC', browser: 'Chrome', actionType: 'LOGIN_EXITOSO', module: 'AUTH', result: 'SUCCESS', details: 'Sesión administrativa iniciada correctamente en puerto seguro.' },
            { id: 2, userId: 2, username: 'Juan', role: 'USER', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), ipAddress: '186.22.45.101', device: 'Android Phone', browser: 'Chrome Mobile', actionType: 'CREAR_RESERVA', module: 'RESERVAS', result: 'SUCCESS', details: 'Reserva RV-2026-0012 creada para Juan Perez.', afterData: '{"id":12,"customerName":"Juan Perez"}' },
            { id: 3, userId: 2, username: 'Juan', role: 'USER', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), ipAddress: '186.22.45.101', device: 'Android Phone', browser: 'Chrome Mobile', actionType: 'CAMBIO_PRECIO', module: 'PAQUETES', result: 'SUCCESS', details: 'Cambio de tarifa en tour VIP.', beforeData: '{"id":1,"price":2500}', afterData: '{"id":1,"price":2850}' },
            { id: 4, userId: 3, username: 'Carlos', role: 'OPERATOR', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), ipAddress: '187.33.22.90', device: 'iPhone 15', browser: 'Safari Mobile', actionType: 'CANCELAR_PAQUETE', module: 'PAQUETES', result: 'SUCCESS', details: 'Cancelado paquete de tour Isla Mujeres.', afterData: '{"id":5,"status":"Cancelado"}' }
        ],
        userWarnings: [
            { id: 1, userId: 2, adminId: 1, title: 'Uso de reservas masivas', message: 'Se detectó un uso inusual de reservas masivas. Por favor evite automatizaciones sin autorización.', severity: 'WARN', behavior: 'POPUP', isRead: false, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() }
        ],
        incidents: [
            { id: 1, userId: 2, adminId: 1, title: 'Inicios de sesión simultáneos', description: 'Se detectó inicio de sesión simultáneo para el usuario Juan desde múltiples IPs (186.22.45.101 y 200.12.98.5).', severity: 'ALTO', status: 'ABIERTO', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() }
        ],
        disciplinaryActions: [
            { id: 1, userId: 2, adminId: 1, action: 'ADVERTENCIA', reason: 'Advertencia push enviada debido a múltiples cancelaciones consecutivas.', createdAt: new Date(Date.now() - 3600000 * 24).toISOString() }
        ],
        userOverrides: [
            { id: 1, username: 'Admin', name: 'System Administrator', role: 'ADMIN', status: 'ACTIVO', isDeleted: false },
            { id: 2, username: 'Juan', name: 'Juan Perez', role: 'USER', status: 'ACTIVO', isDeleted: false },
            { id: 3, username: 'Carlos', name: 'Carlos Mendoza', role: 'OPERATOR', status: 'ACTIVO', isDeleted: false },
            { id: 4, username: 'Ana', name: 'Ana Gomez', role: 'AUDITOR', status: 'ACTIVO', isDeleted: false }
        ]
    };
    
    saveDB(initialDB);
    return initialDB;
}

function saveDB(db: LocalDatabase) {
    try {
        fs.writeFileSync(DB_JSON_PATH, JSON.stringify(db, null, 2), 'utf-8');
    } catch (e) {
        console.error("Error saving JSON db:", e);
    }
}

// Thread-safe access to read and write database
export function getLocalDB(): LocalDatabase {
    return initializeDB();
}

export function writeLocalDB(updater: (db: LocalDatabase) => void) {
    const db = getLocalDB();
    updater(db);
    saveDB(db);
}
