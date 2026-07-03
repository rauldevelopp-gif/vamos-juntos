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
    
    content = content.replace(/<span className="btn-text-mobile-hide">Plantilla<\/span>/g, '<span className="btn-text-mobile-hide">{tr("Plantilla")}</span>');
    content = content.replace(/<span className="btn-text-mobile-hide">\{loading \? 'Cargando\.\.\.' : 'Importar'\}<\/span>/g, '<span className="btn-text-mobile-hide">{loading ? tr("Cargando...") : tr("Importar")}</span>');
    content = content.replace(/title="Descargar Plantilla Excel"/g, 'title={tr("Descargar Plantilla Excel")}');
    
    content = content.replace(/toast\.success\(\`¡Éxito! Se importaron \$\{res\.count\} (.*?)\.\`\)/g, 'toast.success(tr("¡Éxito! Se importaron") + ` ${res.count} ` + tr("$1."));');
    
    content = content.replace(/<span className="btn-text-mobile-hide">Añadir (.*?)<\/span>/g, '<span className="btn-text-mobile-hide">{tr("Añadir $1")}</span>');
    
    content = content.replace(/>Añadir Nuevo Hito Histórico</g, '>{tr("Añadir Nuevo Hito Histórico")}<');
    content = content.replace(/>Añadir Miembro</g, '>{tr("Añadir Miembro")}<');
    content = content.replace(/>Añadir</g, '>{tr("Añadir")}<');

    if (content !== original) {
        fs.writeFileSync(f, content);
        console.log('Updated ' + f);
    }
});
