const fs = require('fs');
let content = fs.readFileSync('CHANGELOG_MEJORAS.txt', 'utf8');

content = content.replace(/10\. GESTIN ADMINISTRATIVA DE HOTELES \(CRUD Y MEJORAS\)\r?\n- Homogeneizacin de iconos de accin \(Editar, Eliminar, Ver Mapa, Habitaciones\) alineando sus tamaos y paddings al diseo global\.\r?\n- Implementacin de 'ConfirmModal' para confirmar la eliminacin de hoteles evitando clics accidentales\.\r?\n- Implementacin de mdulo de importacin masiva por Excel \('HotelExcelUpload'\) con plantilla predefinida y validaciones\./g, 
`10. GESTIÓN ADMINISTRATIVA DE HOTELES (CRUD Y MEJORAS)
---------------------------------------------------------
- Homogeneización de iconos de acción (Editar, Eliminar, Ver Mapa, Habitaciones) alineando sus tamaños y paddings al diseño global.
- Implementación de 'ConfirmModal' para confirmar la eliminación de hoteles evitando clics accidentales.
- Implementación de módulo de importación masiva por Excel ('HotelExcelUpload') con plantilla predefinida y validaciones.`);

fs.writeFileSync('CHANGELOG_MEJORAS.txt', content, 'utf8');
