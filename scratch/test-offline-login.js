async function testLogin() {
    console.log("=== STARTING OFFLINE LOGIN API TEST ===");
    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'Admin', password: '@dmin' })
        });
        const data = await res.json();
        console.log("Response status:", res.status);
        console.log("Response body:", data);
        if (res.ok && data.success) {
            console.log("[+] OFFLINE FALLBACK LOGIN TEST PASSED SUCCESSFULLY!");
        } else {
            console.error("[-] OFFLINE FALLBACK LOGIN TEST FAILED:", data);
        }
    } catch (err) {
        console.error("[-] Connection error during test:", err.message);
    }
}

testLogin();
