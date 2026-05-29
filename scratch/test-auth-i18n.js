async function checkPage(url, enKeyword, esKeyword) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`[-] Failed to fetch ${url}: Status ${res.status}`);
            return;
        }
        const text = await res.text();
        const hasEn = text.includes(enKeyword);
        const hasEs = text.includes(esKeyword);
        console.log(`[+] URL: ${url}`);
        console.log(`    Contains "${enKeyword}" (English keyword): ${hasEn}`);
        console.log(`    Contains "${esKeyword}" (Spanish keyword): ${hasEs}`);
        if (hasEn && !hasEs) {
            console.log(`    Result: CORRECTLY ENGLISH`);
        } else if (hasEs && !hasEn) {
            console.log(`    Result: CORRECTLY SPANISH`);
        } else {
            console.log(`    Result: MIXED OR UNEXPECTED CONTENT`);
        }
    } catch (err) {
        console.error(`[-] Error checking ${url}:`, err.message);
    }
}

async function run() {
    console.log("=== STARTING AUTHENTICATION PAGES LOCALE VALIDATION ===");
    
    // Test Login Page
    await checkPage('http://localhost:3000/en/login', 'Username', 'Usuario');
    await checkPage('http://localhost:3000/es/login', 'Usuario', 'Username');
    
    // Test Forgot Password Page
    await checkPage('http://localhost:3000/en/forgot-password', 'Recover Password', 'Recuperar Contraseña');
    await checkPage('http://localhost:3000/es/forgot-password', 'Recuperar Contraseña', 'Recover Password');
    
    // Test Register Page
    await checkPage('http://localhost:3000/en/register', 'Partner Registration', 'Registro de Socios');
    await checkPage('http://localhost:3000/es/register', 'Registro de Socios', 'Partner Registration');

    console.log("=== LOCALE VALIDATION COMPLETED ===");
}

run();
