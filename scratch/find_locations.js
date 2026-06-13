const fs = require('fs');
const path = require('path');
const srcDirs = ['c:/laragon/www/vamos-juntos/app', 'c:/laragon/www/vamos-juntos/components'];
const excludeDirs = ['c:/laragon/www/vamos-juntos/app/[locale]/admin', 'c:/laragon/www/vamos-juntos/app/api'];

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

const missingTexts = JSON.parse(fs.readFileSync('c:/laragon/www/vamos-juntos/scratch/missing_frontend_texts.json', 'utf-8'));
const keys = Object.keys(missingTexts);
const fileMap = {};

files.forEach(f => {
    if (f.includes('AdminTranslator.tsx')) return;
    const content = fs.readFileSync(f, 'utf-8');
    keys.forEach(k => {
        if (content.includes('>' + k + '<') || content.includes('"' + k + '"') || content.includes("'" + k + "'")) {
            if (!fileMap[f]) fileMap[f] = [];
            fileMap[f].push(k);
        }
    });
});

for (const [file, texts] of Object.entries(fileMap)) {
    console.log('\n--- ' + file.replace('c:/laragon/www/vamos-juntos/', '') + ' ---');
    texts.forEach(t => console.log('  ' + t));
}
