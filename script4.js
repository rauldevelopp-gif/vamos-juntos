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
        if (!content.includes('import { tr') && !content.includes('import {tr')) {
            if (content.includes("import { useState")) {
                content = content.replace(/import .*? from 'react';/, "import { tr, setLanguage } from '@/lib/tr';\n$&");
            } else if (content.includes("import React")) {
                content = content.replace(/import React.*?;\n/, "$&\nimport { tr, setLanguage } from '@/lib/tr';\n");
            } else {
                content = "import { tr, setLanguage } from '@/lib/tr';\n" + content;
            }
        }
    }

    if (content !== original) {
        fs.writeFileSync(f, content);
        console.log('Fixed imports in ' + f);
    }
});
