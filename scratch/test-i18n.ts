async function verifyLanguage(url: string, expectedLang: string, expectedText: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`❌ Fail to fetch ${url}: Status ${res.status}`);
      return;
    }
    const html = await res.text();
    
    // Check lang attribute in <html> tag
    const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/);
    const actualLang = langMatch ? langMatch[1] : 'unknown';
    
    // Check if the expected translation text is present
    const hasText = html.includes(expectedText);
    
    if (actualLang === expectedLang && hasText) {
      console.log(`✅ Success for ${url}:`);
      console.log(`   - Detected HTML lang: "${actualLang}" (Expected: "${expectedLang}")`);
      console.log(`   - Verified unique text: "${expectedText}" is present.`);
    } else {
      console.log(`❌ Mismatch for ${url}:`);
      console.log(`   - Detected HTML lang: "${actualLang}" (Expected: "${expectedLang}")`);
      console.log(`   - Unique text "${expectedText}" present: ${hasText}`);
    }
  } catch (err: any) {
    console.log(`❌ Error fetching ${url}: ${err.message}`);
  }
}

async function run() {
  console.log("=== STARTING PROGRAMMATIC i18n VERIFICATION ===");
  // Test Spanish
  await verifyLanguage('http://localhost:3000/es', 'es', 'Explorar Paquetes');
  // Test English
  await verifyLanguage('http://localhost:3000/en', 'en', 'Explore Packages');
  console.log("=== VERIFICATION FINISHED ===");
}

run();
