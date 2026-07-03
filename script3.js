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

    // Matches <h1 ...>Text</h1> and <h2 ...>Text</h2>
    content = content.replace(/<h1(.*?)>\s*([^<]+?)\s*<\/h1>/g, (match, attrs, text) => {
        if (text.includes('{')) return match; // already has JSX
        return `<h1${attrs}>{tr("${text.trim()}")}</h1>`;
    });
    
    content = content.replace(/<h2(.*?)>\s*([^<]+?)\s*<\/h2>/g, (match, attrs, text) => {
        if (text.includes('{')) return match; // already has JSX
        return `<h2${attrs}>{tr("${text.trim()}")}</h2>`;
    });
    
    // Also the generic "Añadir XXX" inside <span className="btn-text-mobile-hide">
    content = content.replace(/<span className="btn-text-mobile-hide">([^<]+?)<\/span>/g, (match, text) => {
        if (text.includes('{')) return match;
        return `<span className="btn-text-mobile-hide">{tr("${text.trim()}")}</span>`;
    });

    if (content !== original) {
        fs.writeFileSync(f, content);
        console.log('Updated headers/spans in ' + f);
    }
});
