const fs = require('fs');

const missingKeys = {
  'aeropuertos.': 'airports.',
  'Nuevo Aeropuerto': 'New Airport',
  'atracciones.': 'attractions.',
  'playas.': 'beaches.',
  'Nueva Playa': 'New Beach',
  'restaurantes.': 'restaurants.',
  'Subiendo foto del conductor...': 'Uploading driver photo...',
  'Foto subida': 'Photo uploaded',
  'Error al subir': 'Error uploading',
  'Error al subir foto': 'Error uploading photo',
  'Fotos del vehículo subidas': 'Vehicle photos uploaded',
  'Error al subir fotos': 'Error uploading photos',
  'No se pudo guardar': 'Could not save',
  'Editar Vehículo': 'Edit Vehicle',
  'Registrar Nuevo Vehículo': 'Register New Vehicle',
  'Placa / Matrícula': 'License Plate',
  'Color': 'Color',
  'Categoría (Tipo)': 'Category (Type)',
  'Maletas': 'Luggage',
  'Galería del Vehículo': 'Vehicle Gallery',
  'Agregar Fotos': 'Add Photos',
  'No hay fotos del vehículo. Sube algunas imágenes para mostrarlas a los clientes.': 'No vehicle photos. Upload some images to show them to clients.',
  'Datos del Conductor': 'Driver Details',
  'Foto': 'Photo',
  'Nombre del Chofer': 'Driver Name',
  'Vencimiento de Licencia': 'License Expiration',
  'Amenidades Disponibles': 'Available Amenities',
  'En Mantenimiento': 'In Maintenance',
  'Ocupado': 'Occupied',
  'Guardar Cambios': 'Save Changes',
  'Registrar Vehículo': 'Register Vehicle',
  'yates.': 'yachts.'
};

let content = fs.readFileSync('lib/tr.ts', 'utf8');

// remove closing brace
content = content.replace(/};\s*export const tr/g, '  // new keys\n};\n\nexport const tr');

let newEntries = [];
for (let [key, value] of Object.entries(missingKeys)) {
    newEntries.push(`  "${key}": "${value}"`);
}

content = content.replace('  // new keys\n};', ',\n' + newEntries.join(',\n') + '\n};');

fs.writeFileSync('lib/tr.ts', content);
console.log('Added new translations!');
