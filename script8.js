const fs = require('fs');

const missingKeys = {
  'Gestiona destinos costeros y playas': 'Manage coastal destinations and beaches',
  'Gestiona restaurantes y ofertas culinarias': 'Manage restaurants and culinary offerings'
};

let content = fs.readFileSync('lib/tr.ts', 'utf8');

content = content.replace(/};\s*export const tr/g, '  // new keys\n};\n\nexport const tr');

let newEntries = [];
for (let [key, value] of Object.entries(missingKeys)) {
    newEntries.push(`  "${key}": "${value}"`);
}

content = content.replace('  // new keys\n};', ',\n' + newEntries.join(',\n') + '\n};');

fs.writeFileSync('lib/tr.ts', content);
console.log('Added new translations!');
