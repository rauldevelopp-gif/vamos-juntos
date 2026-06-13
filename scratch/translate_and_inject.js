const fs = require('fs');
const path = require('path');

async function translateText(text) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0].map(item => item[0]).join('');
    } catch (e) {
        console.error("Translation error for:", text);
        return text; // Fallback to original
    }
}

async function main() {
    console.log("Starting translation process...");
    const missingFile = 'c:/laragon/www/vamos-juntos/scratch/missing_texts.json';
    const missing = JSON.parse(fs.readFileSync(missingFile, 'utf-8'));
    const keys = Object.keys(missing);
    
    const translatedDict = {};
    
    // Process in batches
    const batchSize = 10;
    for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        const promises = batch.map(async (key) => {
            const translated = await translateText(key);
            translatedDict[key] = translated;
        });
        await Promise.all(promises);
        console.log(`Translated ${i + batch.length} / ${keys.length}`);
        // Small delay to prevent rate limit
        await new Promise(r => setTimeout(r, 200));
    }

    // Prepare code to inject
    let newEntries = Object.entries(translatedDict)
        .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
        .join(',\n');
        
    // 1. Inject into lib/tr.ts
    const trFile = 'c:/laragon/www/vamos-juntos/lib/tr.ts';
    let trContent = fs.readFileSync(trFile, 'utf-8');
    trContent = trContent.replace(/};\s*export const tr =/, `,\n${newEntries}\n};\n\nexport const tr =`);
    fs.writeFileSync(trFile, trContent);
    console.log("Updated lib/tr.ts");

    // 2. Inject into components/AdminTranslator.tsx
    const adminTransFile = 'c:/laragon/www/vamos-juntos/components/AdminTranslator.tsx';
    let atContent = fs.readFileSync(adminTransFile, 'utf-8');
    atContent = atContent.replace(/};\s*export default function AdminTranslator/, `,\n${newEntries}\n};\n\nexport default function AdminTranslator`);
    fs.writeFileSync(adminTransFile, atContent);
    console.log("Updated AdminTranslator.tsx");

    console.log("Done!");
}

main();
