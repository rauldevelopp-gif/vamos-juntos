// Load .env manually to ensure env vars are loaded
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('DB URL:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':***@'));
    
    const p = new PrismaClient({
        log: ['error'],
    });
    
    try {
        await p.$connect();
        console.log('✅ CONECTADO');
        
        const totalPackages = await p.package.count();
        const withClientId = await p.package.count({ where: { NOT: { clientId: null } } });
        const withoutClientId = await p.package.count({ where: { clientId: null } });
        const byStatus = await p.package.groupBy({ by: ['status'], _count: true });
        const users = await p.user.findMany({ select: { id: true, username: true, role: true } });
        
        console.log('\n--- DIAGNÓSTICO ---');
        console.log('Total paquetes en DB:', totalPackages);
        console.log('Con clientId (solicitudes):', withClientId);
        console.log('Sin clientId (catálogo):', withoutClientId);
        console.log('Por status:', JSON.stringify(byStatus, null, 2));
        console.log('Usuarios:', JSON.stringify(users, null, 2));
        
    } catch (e) {
        console.error('❌ ERROR:', e.message);
    } finally {
        await p.$disconnect();
    }
}
main();
