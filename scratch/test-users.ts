import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function run() {
    console.log("=== CHECKING USERS IN DATABASE ===");
    try {
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users:`);
        for (const user of users) {
            console.log(`- ID: ${user.id}, Username: "${user.username}", Email: "${user.email}", Role: "${user.role}", Status: "${user.status}", Password Hash: "${user.password}"`);
        }
        
        // Verify Admin login credentials
        const password = "@dmin";
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        console.log(`\nVerifying password "@dmin" hash: "${hashedPassword}"`);
        
        const adminUser = users.find(u => u.username.toLowerCase() === 'admin');
        if (adminUser) {
            console.log(`Admin exists! Hashed password matches: ${adminUser.password === hashedPassword}`);
        } else {
            console.log(`Admin user does not exist in the database!`);
        }
    } catch (err) {
        console.error("[-] Database error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

run();
