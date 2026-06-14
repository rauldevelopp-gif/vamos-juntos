const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const trContent = fs.readFileSync('lib/tr.ts', 'utf8');
const missingKeys = new Set();

walkDir('app/[locale]/admin', (f) => {
    if (!f.endsWith('.tsx')) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // match tr("...") or tr('...')
    let regex = /tr\(['"](.*?)['"]\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let key = match[1];
        if (!trContent.includes(`"${key}":`) && !trContent.includes(`'${key}':`)) {
            missingKeys.add(key);
        }
    }
});

console.log(Array.from(missingKeys));
