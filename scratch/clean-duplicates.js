const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '..', 'app', '[locale]', 'admin');

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = getFilesRecursively(adminDir);

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Remove duplicate "const { language } = useLanguage();" inside the same function scope
  // We can search for the component-level "tr" helper block:
  // "const isEn = language === 'en';\n  const tr = (txt) => { ..." and remove it
  const localTrRegex = /const\s+isEn\s*=\s*language\s*===\s*'en';\s*const\s+tr\s*=\s*\(txt\)\s*=>\s*\{[\s\S]*?if\s*\(isEn\s*&&\s*dict\[txt\]\)\s*return\s*dict\[txt\];[\s\S]*?\};\s*/g;
  content = content.replace(localTrRegex, '');

  const duplicateLanguageRegex = /const\s+\{\s*language\s*\}\s*=\s*useLanguage\(\);\s*const\s+\{\s*language\s*\}\s*=\s*useLanguage\(\);/g;
  content = content.replace(duplicateLanguageRegex, 'const { language } = useLanguage();');

  // Let's also check for duplicate const { language } = useLanguage() when one is followed by currentLanguage setter
  // E.g.:
  // const { language } = useLanguage();
  // currentLanguage = language;
  // const { language } = useLanguage();
  const dupLangSetterRegex = /const\s+\{\s*language\s*\}\s*=\s*useLanguage\(\);\s*currentLanguage\s*=\s*language;\s*const\s+\{\s*language\s*\}\s*=\s*useLanguage\(\);/g;
  content = content.replace(dupLangSetterRegex, `const { language } = useLanguage();\n  currentLanguage = language;`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned duplicates in: ${path.relative(adminDir, filePath)}`);
  }
});
