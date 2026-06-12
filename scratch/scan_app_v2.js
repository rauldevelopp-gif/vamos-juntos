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

const englishWords = new Set(['flex', 'center', 'absolute', 'relative', 'left', 'right', 'top', 'bottom', 'width', 'height', 'color', 'background', 'border', 'margin', 'padding', 'display', 'justify', 'align', 'text', 'font', 'weight', 'size', 'line', 'shadow', 'radius', 'transition', 'transform', 'opacity', 'cursor', 'pointer', 'hover', 'active', 'focus', 'hidden', 'visible', 'auto', 'none', 'block', 'inline', 'grid', 'column', 'row', 'gap', 'var', 'rgba', 'rgb', 'hsl', 'hsla', 'transparent', 'solid', 'dashed', 'dotted', 'double', 'px', 'rem', 'em', 'vh', 'vw', 'min', 'max', 'calc', 'url', 'http', 'https', 'www', 'com', 'org', 'net', 'io', 'co', 'es', 'en', 'es-MX', 'es-ES', 'en-US', 'en-GB', 'admin', 'user', 'guest', 'role', 'status', 'type', 'id', 'name', 'email', 'password', 'token', 'auth', 'login', 'logout', 'register', 'profile', 'settings', 'dashboard', 'home', 'about', 'contact', 'terms', 'privacy', 'cookie', 'session', 'cookieStore', 'next-intl', 'use client', 'use server', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'application/json', 'multipart/form-data', 'text/plain', 'text/html', 'UTF-8', 'ISO-8859-1', 'Error', 'Warning', 'Info', 'Success', 'true', 'false', 'null', 'undefined', 'NaN', 'Infinity', 'Math', 'Date', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'RegExp', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Error', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'default', 'import', 'export', 'const', 'let', 'var', 'function', 'class', 'extends', 'implements', 'interface', 'type', 'enum', 'public', 'private', 'protected', 'static', 'readonly', 'async', 'await', 'try', 'catch', 'finally', 'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'return', 'yield', 'throw', 'new', 'delete', 'typeof', 'instanceof', 'void', 'this', 'super', 'window', 'document', 'console', 'process', 'module', 'exports', 'require', 'global', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'fetch', 'Headers', 'Request', 'Response', 'URL', 'URLSearchParams', 'FormData', 'Blob', 'File', 'FileReader', 'Event', 'CustomEvent', 'EventListener', 'Node', 'Element', 'HTMLElement', 'HTMLDivElement', 'HTMLButtonElement', 'HTMLInputElement', 'HTMLFormElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'HTMLAnchorElement', 'HTMLImageElement', 'HTMLVideoElement', 'HTMLAudioElement', 'HTMLCanvasElement', 'HTMLIFrameElement', 'HTMLScriptElement', 'HTMLStyleElement', 'HTMLHeadElement', 'HTMLBodyElement', 'HTMLHtmlElement', 'react', 'next', 'lucide-react', 'z-index', 'items-center', 'justify-between', 'flex-col', 'w-full', 'h-full', 'bg-']);

let allText = new Set();
const regex = /['"`]([A-ZÁÉÍÓÚÑ¡¿][^'"`]{2,50})['"`]/g; // Starts with uppercase or ¡¿, length 3-50
const regex2 = />\s*([^<{}]+?)\s*</g; // Text between tags

files.forEach(f => {
    if (f.includes('PublicTranslator.tsx') || f.includes('AdminTranslator.tsx')) return;
    const content = fs.readFileSync(f, 'utf-8');
    
    let match;
    while ((match = regex.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && /[a-záéíóúñ]/.test(text) && text.length > 2 && !text.includes('var(')) {
            allText.add(text);
        }
    }
    while ((match = regex2.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && /[a-záéíóúñ]/.test(text) && text.length > 2 && !text.includes('var(')) {
            allText.add(text);
        }
    }
});

const dictPath = path.join('c:/laragon/www/vamos-juntos/components/PublicTranslator.tsx');
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
    
    // Check if looks like code or URL
    if (/^[A-Z_]+$/.test(text)) return false;
    if (/^[a-z\-]+$/.test(text) && englishWords.has(text)) return false;
    if (text.startsWith('http') || text.startsWith('www') || text.startsWith('/')) return false;
    if (text.includes('=>') || text.includes('===') || text.includes('&&') || text.includes('||')) return false;
    
    // Check if any word in the text is a common english/code word (heuristic for false positives)
    const words = text.split(/[\s-]+/);
    if (words.length === 1 && englishWords.has(words[0].toLowerCase())) return false;
    
    const t = text.replace(/"/g, '\\"');
    return !dictContent.includes('"' + t + '"') && !dictContent.includes("'" + t + "'");
});

const cleanMissing = missing.filter(m => {
    if (m.startsWith('//') || m.startsWith('/*')) return false;
    if (m.includes('useState') || m.includes('console.')) return false;
    if (m.includes('className=')) return false;
    return true;
});

const result = {};
cleanMissing.forEach(m => result[m] = m + " (EN)");

fs.writeFileSync('c:/laragon/www/vamos-juntos/scratch/missing_frontend_texts_v2.json', JSON.stringify(result, null, 2));
console.log("Found", cleanMissing.length, "potential missing strings.");
