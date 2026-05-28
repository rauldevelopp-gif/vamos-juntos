import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

try {
    const rows = await prisma.$queryRaw`SELECT id, username, role, password FROM "User" WHERE LOWER(username) = 'admin' LIMIT 1`;
    console.log('User found:', JSON.stringify(rows, null, 2));

    if (rows.length > 0) {
        const storedHash = rows[0].password;
        const candidates = ['Admin123', 'admin123', 'Admin123**', 'Lianis123**', 'admin', 'Admin', '123456', 'password'];
        candidates.forEach(p => {
            const hash = crypto.createHash('sha256').update(p).digest('hex');
            if (hash === storedHash) {
                console.log(`\n✅ PASSWORD MATCH: "${p}"`);
            }
        });
        console.log('\nStored hash (first 20 chars):', storedHash.substring(0, 20) + '...');
    }
} catch (e) {
    console.error('Error:', e.message);
} finally {
    await prisma.$disconnect();
}
