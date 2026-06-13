const fs = require('fs');
const path = require('path');

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
    const missingFile = 'c:/laragon/www/vamos-juntos/scratch/missing_frontend_texts.json';
    const missing = JSON.parse(fs.readFileSync(missingFile, 'utf-8'));
    const keys = Object.keys(missing);
    
    const translatedDict = {};
    
    const batchSize = 10;
    for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        const promises = batch.map(async (key) => {
            const translated = await translateText(key);
            translatedDict[key] = translated;
        });
        await Promise.all(promises);
        await new Promise(r => setTimeout(r, 200));
    }

    let mapEntries = Object.entries(translatedDict)
        .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
        .join(',\n');

    const publicTranslatorCode = `"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const publicTranslationMap: Record<string, string> = {
${mapEntries}
};

export default function PublicTranslator({ children }: { children: React.ReactNode }) {
    const { language } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || language !== 'en') return;

        let timeoutId: NodeJS.Timeout;

        const translateNode = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue?.trim();
                if (text && publicTranslationMap[text]) {
                    node.nodeValue = node.nodeValue!.replace(text, publicTranslationMap[text]);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as Element;
                if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
                
                // Translate placeholder
                if (el.hasAttribute('placeholder')) {
                    const placeholder = el.getAttribute('placeholder')?.trim();
                    if (placeholder && publicTranslationMap[placeholder]) {
                        el.setAttribute('placeholder', publicTranslationMap[placeholder]);
                    }
                }

                // Translate title
                if (el.hasAttribute('title')) {
                    const title = el.getAttribute('title')?.trim();
                    if (title && publicTranslationMap[title]) {
                        el.setAttribute('title', publicTranslationMap[title]);
                    }
                }
                
                node.childNodes.forEach(translateNode);
            }
        };

        const runTranslation = () => {
            translateNode(document.body);
        };

        const observer = new MutationObserver((mutations) => {
            let shouldTranslate = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0 || mutation.type === 'characterData') {
                    shouldTranslate = true;
                    break;
                }
            }
            if (shouldTranslate) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(runTranslation, 50);
            }
        });

        runTranslation();
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [language, mounted]);

    return <>{children}</>;
}
`;

    fs.writeFileSync('c:/laragon/www/vamos-juntos/components/PublicTranslator.tsx', publicTranslatorCode);
    console.log("Created PublicTranslator.tsx");
}

main();
