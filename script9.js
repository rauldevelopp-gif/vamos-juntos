const fs = require('fs');
let content = fs.readFileSync('CHANGELOG_MEJORAS.txt', 'utf8');

// Fix the corrupted text
content = content.replace(/GESTIN/g, 'GESTIÓN');
content = content.replace(/Homogeneizacin/g, 'Homogeneización');
content = content.replace(/accin/g, 'acción');
content = content.replace(/tamaos/g, 'tamaños');
content = content.replace(/diseo/g, 'diseño');
content = content.replace(/eliminacin/g, 'eliminación');
content = content.replace(/Implementacin/g, 'Implementación');
content = content.replace(/mdulo/g, 'módulo');
content = content.replace(/importacin/g, 'importación');

content += `
11. HOMOLOGACIÓN DE INTERNACIONALIZACIÓN (i18n) EN PANELES ADMINISTRATIVOS
---------------------------------------------------------
- Revisión exhaustiva de todas las vistas del panel de administración (app/[locale]/admin).
- Envoltura reactiva con la función tr() para todos los títulos, subtítulos descriptivos y botones de acción ("Añadir Hotel", "Añadir Playa", etc.).
- Traducción dinámica de los componentes de subida masiva por Excel (HotelExcelUpload, TaxiExcelUpload, YachtExcelUpload, etc.), asegurando que los botones "Plantilla", "Importar", "Cargando..." y los mensajes de estado (Toasts) respondan instantáneamente al cambio de idioma.
- Extracción e inyección de más de 30 nuevas frases al diccionario maestro bilingüe (lib/tr.ts) para lograr un backend multi-idioma 100% integral.

12. REDISEÑO Y MEJORAS EN LA VISTA PRINCIPAL (HOME FRONTEND)
---------------------------------------------------------
- Integración del conversor multi-moneda formatPrice en la visualización de los "Paquetes Destacados", unificando el formato de precios con el resto de la plataforma.
- Implementación de la nueva sección "Por qué reservar con Vamos Juntos" (Why book with VamosJuntos).
- Diseño visual moderno mediante cuadrículas (CSS Grid) y tarjetas con animaciones flotantes (float-animation) e iconos vectoriales iluminados estilo glassmorphism.
- Internacionalización completa de los títulos y descripciones de la nueva sección conectada directamente al LanguageContext.
`;

fs.writeFileSync('CHANGELOG_MEJORAS.txt', content, 'utf8');
console.log('Changelog actualizado con éxito!');
