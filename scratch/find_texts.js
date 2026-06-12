const fs = require('fs');
const path = require('path');

const adminDir = path.join('c:/laragon/www/vamos-juntos/app/[locale]/admin');

let files = [];
function findFiles(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath);
        } else if (file.endsWith('.tsx')) {
            files.push(filePath);
        }
    });
}
findFiles(adminDir);

let allText = new Set();
const regex = />([^<{}]+)</g;
const quotesRegex = /placeholder=["']([^"']+)["']/g;
const titleRegex = /title=["']([^"']+)["']/g;

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf-8');
    let match;
    while ((match = regex.exec(content)) !== null) {
        let text = match[1].trim();
        // Ignore single words less than 3 chars or strings with no letters
        if (text && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(text) && text.length > 2 && !text.includes('var(')) {
            allText.add(text);
        }
    }
    while ((match = quotesRegex.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(text) && text.length > 2) {
            allText.add(text);
        }
    }
    while ((match = titleRegex.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(text) && text.length > 2) {
            allText.add(text);
        }
    }
});

const dictPath = path.join('c:/laragon/www/vamos-juntos/lib/tr.ts');
const dictContent = fs.readFileSync(dictPath, 'utf-8');

const missing = Array.from(allText).filter(text => {
    const t = text.replace(/"/g, '\\"');
    return !dictContent.includes('"' + t + '"') && !dictContent.includes("'" + t + "'");
});

// Remove some garbage from missing list
const cleanMissing = missing.filter(m => {
    if (m.startsWith('//') || m.startsWith('/*')) return false;
    if (m.includes('useState') || m.includes('=>') || m.includes('===') || m.includes('&&') || m.includes('||')) return false;
    if (m.includes('console.log') || m.includes('function(')) return false;
    if (m.includes('return') || m.includes('import ') || m.includes('export ')) return false;
    if (m.includes('const ') || m.includes('let ')) return false;
    if (m.startsWith('$(') || m.startsWith('l.')) return false;
    if (m.includes('!==')) return false;
    return true;
});

const dictToAdd = {};
cleanMissing.forEach(m => {
    dictToAdd[m] = m + " (EN)"; // Placeholder for English translation
});

fs.writeFileSync('c:/laragon/www/vamos-juntos/scratch/missing_texts.json', JSON.stringify(dictToAdd, null, 2));
console.log('Saved to missing_texts.json. Total count:', Object.keys(dictToAdd).length);
