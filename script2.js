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

    if (content.includes('tr(')) {
        if (!content.includes('import { tr')) {
            // Find the first import and inject it there if possible
            if (content.includes("import { useState")) {
                content = content.replace(/import .*? from 'react';/, "import { tr, setLanguage } from '@/lib/tr';\n$&");
            } else {
                content = "import { tr, setLanguage } from '@/lib/tr';\n" + content;
            }
        } else if (!content.includes('setLanguage')) {
            content = content.replace(/import \{ tr \} from '@\/lib\/tr';/, "import { tr, setLanguage } from '@/lib/tr';");
        }
        
        if (!content.includes('useLanguage')) {
            if (content.includes("import { useState")) {
                content = content.replace(/(import .*? from 'react';)/, "$1\nimport { useLanguage } from '@/context/LanguageContext';");
            } else {
                content = "import { useLanguage } from '@/context/LanguageContext';\n" + content;
            }
        }
        
        if (!content.includes('const { language } = useLanguage()')) {
            content = content.replace(/(export default function .*?\(.*?\) \{)/, "$1\n    const { language } = useLanguage();\n    setLanguage(language);");
        }
    }

    if (content !== original) {
        fs.writeFileSync(f, content);
        console.log('Updated imports in ' + f);
    }
});
