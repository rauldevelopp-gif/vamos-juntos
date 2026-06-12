const fs = require('fs');

async function translateText(text) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0].map(item => item[0]).join('');
    } catch (e) {
        console.error("Translation error for:", text);
        return text;
    }
}

async function main() {
    const missingFile = 'c:/laragon/www/vamos-juntos/scratch/missing_frontend_texts_v2.json';
    const missing = JSON.parse(fs.readFileSync(missingFile, 'utf-8'));
    const keys = Object.keys(missing);
    
    // Filter out strings that are obviously code snippets or english only
    const validKeys = keys.filter(k => {
        if (k.length < 3) return false;
        if (!/[a-záéíóúñ]/i.test(k)) return false;
        if (k.includes('? :') || k.includes('===') || k.includes('=>') || k.includes(';')) return false;
        if (k.includes('? hotel.gallery') || k.includes('0 ? room.gallery')) return false;
        if (k.includes('M16 11.37')) return false;
        return true;
    });

    const translatedDict = {};
    const batchSize = 10;
    
    console.log(`Translating ${validKeys.length} new strings...`);
    for (let i = 0; i < validKeys.length; i += batchSize) {
        const batch = validKeys.slice(i, i + batchSize);
        const promises = batch.map(async (key) => {
            const translated = await translateText(key);
            translatedDict[key] = translated;
        });
        await Promise.all(promises);
        await new Promise(r => setTimeout(r, 100)); // Rate limit
    }

    // Read PublicTranslator
    const ptPath = 'c:/laragon/www/vamos-juntos/components/PublicTranslator.tsx';
    let ptContent = fs.readFileSync(ptPath, 'utf-8');

    // Extract the existing dictionary
    const match = ptContent.match(/export const publicTranslationMap: Record<string, string> = {([\s\S]*?)};\r?\n\r?\nexport default function PublicTranslator/);
    if (!match) {
        console.error("Could not parse PublicTranslator.tsx");
        return;
    }
    
    const dictText = match[1];
    const mapEntries = Object.entries(translatedDict)
        .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
        .join(',\n');

    ptContent = ptContent.replace(dictText, dictText + ',\n' + mapEntries + '\n');
    
    fs.writeFileSync(ptPath, ptContent);
    console.log("Updated PublicTranslator.tsx successfully");
}

main();
