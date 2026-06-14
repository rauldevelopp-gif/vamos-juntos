const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('app/[locale]/admin', (f) => {
    if (!f.endsWith('.tsx')) return;
    let content = fs.readFileSync(f, 'utf8');
    let original = content;

    content = content.replace(/<p style=\{\{\s*color:\s*'var\(--text-muted\)',\s*margin:\s*'0\.2rem 0 0 0'\s*\}\}>\s*([\s\S]*?)\s*<\/p>/g, (match, text) => {
        if (text.includes('{')) return match; // already has JSX
        return `<p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{tr("${text.trim()}")}</p>`;
    });

    content = content.replace(/<p style=\{\{\s*color:\s*'var\(--text-muted\)',\s*margin:\s*'0\.5rem 0 0 0'\s*\}\}>\s*([\s\S]*?)\s*<\/p>/g, (match, text) => {
        if (text.includes('{')) return match; // already has JSX
        return `<p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>{tr("${text.trim()}")}</p>`;
    });

    if (content !== original) {
        fs.writeFileSync(f, content);
        console.log('Updated paragraphs in ' + f);
    }
});
