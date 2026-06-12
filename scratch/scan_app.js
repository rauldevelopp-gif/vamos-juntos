const fs = require('fs');
const path = require('path');

const srcDirs = [
    'c:/laragon/www/vamos-juntos/app',
    'c:/laragon/www/vamos-juntos/components'
];

const excludeDirs = [
    'c:/laragon/www/vamos-juntos/app/[locale]/admin',
    'c:/laragon/www/vamos-juntos/app/api'
];

let files = [];
function findFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file).replace(/\\/g, '/');
        if (excludeDirs.some(ex => filePath.startsWith(ex))) return;
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            files.push(filePath);
        }
    });
}
srcDirs.forEach(d => findFiles(d));

let allText = new Set();
const regex = />([^<{}]+)</g;
const quotesRegex = /placeholder=["']([^"']+)["']/g;
const titleRegex = /title=["']([^"']+)["']/g;

files.forEach(f => {
    if (f.includes('AdminTranslator.tsx')) return;
    const content = fs.readFileSync(f, 'utf-8');
    let match;
    while ((match = regex.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(text) && text.length > 3 && !text.includes('var(')) {
            allText.add(text);
        }
    }
    while ((match = quotesRegex.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(text) && text.length > 3) {
            allText.add(text);
        }
    }
    while ((match = titleRegex.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(text) && text.length > 3) {
            allText.add(text);
        }
    }
});

const dictPath = path.join('c:/laragon/www/vamos-juntos/lib/tr.ts');
const dictContent = fs.existsSync(dictPath) ? fs.readFileSync(dictPath, 'utf-8') : '';

const localesDir = 'c:/laragon/www/vamos-juntos/locales/es';
let localeValues = [];
if (fs.existsSync(localesDir)) {
    const localeFiles = fs.readdirSync(localesDir);
    localeFiles.forEach(lf => {
        const json = JSON.parse(fs.readFileSync(path.join(localesDir, lf), 'utf-8'));
        localeValues = localeValues.concat(Object.values(json));
    });
}

const missing = Array.from(allText).filter(text => {
    if (localeValues.includes(text)) return false;
    if (/^[a-z]+[A-Z][a-zA-Z]*$/.test(text)) return false; 
    if (/^[A-Z_]+$/.test(text)) return false;
    const t = text.replace(/"/g, '\\"');
    return !dictContent.includes('"' + t + '"') && !dictContent.includes("'" + t + "'");
});

const cleanMissing = missing.filter(m => {
    if (m.startsWith('//') || m.startsWith('/*')) return false;
    if (m.includes('useState') || m.includes('=>') || m.includes('===') || m.includes('&&')) return false;
    if (m.includes('return ') || m.includes('import ') || m.includes('export ')) return false;
    if (m.includes('console.log') || m.includes('case ')) return false;
    if (m.includes('const ') || m.includes('let ') || m.includes('function')) return false;
    if (m.includes('!==') || m.includes('?') || m.includes('Promise') || m.includes(';')) return false;
    return true;
});

const result = {};
cleanMissing.forEach(m => result[m] = m + " (EN)");

fs.writeFileSync('c:/laragon/www/vamos-juntos/scratch/missing_frontend_texts.json', JSON.stringify(result, null, 2));
