const fs = require('fs');
const path = require('path');

const adminDictionary = {
  "Centro de Reportes": "Reports Center",
  "Análisis completo con gráficas interactivas": "Comprehensive analysis with interactive charts",
  "10 módulos disponibles": "10 modules available",
  "Reporte de Reservas": "Reservations Report",
  "Gestión de reservas, conversiones por estados, destinos populares y ocupación de cupos": "Management of reservations, conversions by state, popular destinations and coupon occupancy",
  "Reporte General (1.1)": "General Report (1.1)",
  "Por Estado (1.2)": "By Status (1.2)",
  "Por Destino (1.3)": "By Destination (1.3)",
  "Ocupación (1.4)": "Occupancy (1.4)",
  "Total Reservas": "Total Reservations",
  "Reservas Activas": "Active Reservations",
  "Ticket Promedio": "Average Ticket",
  "Conversión": "Conversion",
  "Semana": "Week",
  "Mes": "Month",
  "Trimestre": "Quarter",
  "Año": "Year",
  "Actualizar": "Refresh",
  "Exportar CSV": "Export CSV",
  "Filtros Avanzados": "Advanced Filters",
  "Ocultar Filtros": "Hide Filters",
  "Buscar por cliente, código, paquete, hotel...": "Search by customer, code, package, hotel...",
  "Catálogo de Playas": "Beaches Catalog",
  "Catálogo de Hoteles": "Hotels Catalog",
  "Catálogo de Atracciones": "Attractions Catalog",
  "Catálogo de Restaurantes": "Restaurants Catalog",
  "Catálogo de Taxis": "VIP Taxi Fleet",
  "Catálogo de Yates": "Premium Yacht Fleet",
  "Catálogo de Aeropuertos": "Airports Catalog",
  "Catálogo de Paquetes": "Packages Catalog",
  "Catálogo de Paquetes Turísticos": "Tour Packages Catalog",
  "Catálogo de Cupones": "Coupons Catalog",
  "Catálogo de Descuentos": "Discounts Catalog",
  "Gestión de destinos costeros y zonas de embarque.": "Management of coastal destinations and boarding zones.",
  "Gestión de aeropuertos y pistas de aterrizaje.": "Management of airports and landing tracks.",
  "Gestión de hoteles, resorts y villas de lujo.": "Management of luxury hotels, resorts, and boutique stays.",
  "Gestión de atracciones locales y actividades VIP.": "Management of local attractions and VIP activities.",
  "Gestión de restaurantes exclusivos y experiencias gastronómicas.": "Management of exclusive restaurants and gastronomic experiences.",
  "Gestión de vehículos VIP y transportistas autorizados.": "Management of VIP vehicles and authorized transporters.",
  "Gestión de la flota de yates y embarcaciones premium.": "Management of premium yachts and exclusive vessels.",
  "Gestión de cupones y códigos de descuento.": "Management of coupons and discount codes.",
  "Gestión de usuarios del sistema y permisos de acceso.": "Management of system users and access permissions.",
  "Panel de Administración": "Administration Panel",
  "Reportes Administrativos": "Administrative Reports",
  "Super Reportes Administrativos": "Super Administrative Reports",
  "Control de Reservas de Clientes": "Customer Reservations Control",
  "Control de Reservas de Hotel": "Hotel Reservations Control",
  "Solicitudes de Cotización": "Custom Quote Requests",
  "Gestión de Usuarios y Roles": "Users and Roles Management",
  "Facturación y Pagos": "Billing and Payments",
  "Añadir Playa": "Add Beach",
  "Añadir Aeropuerto": "Add Airport",
  "Añadir Hotel": "Add Hotel",
  "Añadir Atracción": "Add Attraction",
  "Añadir Restaurante": "Add Restaurant",
  "Añadir Yate": "Add Yacht",
  "Añadir Conductor": "Add Driver",
  "Añadir Vehículo": "Add Vehicle",
  "Añadir Usuario": "Add User",
  "Añadir Cupón": "Add Coupon",
  "Agregar Terminal": "Add Terminal",
  "Guardar": "Save",
  "Cancelar": "Cancel",
  "Cerrar": "Close",
  "Cerrar Mapa": "Close Map",
  "Ver Costa": "View Coast",
  "Ver Mapa": "View Map",
  "Ver Ubicación": "View Location",
  "Editar": "Edit",
  "Eliminar": "Delete",
  "Acciones": "Actions",
  "Crear": "Create",
  "Nuevo": "New",
  "Buscar": "Search",
  "Filtrar": "Filter",
  "Limpiar": "Clear",
  "Nombre / Tipo": "Name / Type",
  "Nombre": "Name",
  "Ubicación": "Location",
  "Estado": "Status",
  "Mapa": "Map",
  "Código IATA": "IATA Code",
  "Ciudad": "City",
  "Coordenadas": "Coordinates",
  "Estrellas": "Stars",
  "Habitaciones": "Rooms",
  "Tipo de Cocina": "Cuisine Type",
  "Dirección": "Address",
  "Modelo": "Model",
  "Placas": "License Plate",
  "Conductor Asignado": "Assigned Driver",
  "Chofer Asignado": "Assigned Driver",
  "Eslora": "Length",
  "Capacidad": "Capacity",
  "Precio por Hora": "Price per Hour",
  "Tripulación Incluida": "Crew Included",
  "Porcentaje": "Percentage",
  "Fecha Expiración": "Expiration Date",
  "Límite Usos": "Usage Limit",
  "Usos": "Uses",
  "Activo": "Active",
  "Inactivo": "Inactive",
  "Abierta": "Open",
  "Cerrada": "Closed",
  "Operativo": "Operational",
  "No Operativo": "Non-Operational",
  "IATA": "IATA",
  "IATA / Ciudad": "IATA / City",
  "Precio Base": "Base Price",
  "Habitaciones Disponibles": "Available Rooms",
  "Descripción": "Description",
  "Descripción del Hotel": "Hotel Description",
  "Sincronizando destinos...": "Synchronizing destinations...",
  "Sincronizando playas...": "Synchronizing beaches...",
  "Sincronizando aeropuertos...": "Synchronizing airports...",
  "Sincronizando hoteles...": "Synchronizing hotels...",
  "Sincronizando atracciones...": "Synchronizing attractions...",
  "Sincronizando restaurantes...": "Synchronizing restaurants...",
  "Sincronizando vehículos...": "Synchronizing vehicles...",
  "Sincronizando yates...": "Synchronizing yachts...",
  "Cargando...": "Loading...",
  "Cargando playas...": "Loading beaches...",
  "Cargando terminales...": "Loading terminals...",
  "Cargando hoteles...": "Loading hotels...",
  "Cargando atracciones...": "Loading attractions...",
  "Cargando restaurantes...": "Loading restaurants...",
  "Cargando vehículos...": "Loading vehicles...",
  "Cargando yates...": "Loading yachts...",
  "Cargando reservas...": "Loading reservations...",
  "Guardando...": "Saving...",
  "Procesando...": "Processing...",
  "No hay playas registradas": "No beaches registered",
  "No hay aeropuertos registrados": "No airports registered",
  "No hay hoteles registrados": "No hotels registered",
  "No hay atracciones registradas": "No attractions registered",
  "No hay restaurantes registrados": "No restaurants registered",
  "No hay vehículos registrados": "No vehicles registered",
  "No hay yates registrados": "No yachts registered",
  "No hay cupones registrados": "No coupons registered",
  "No hay usuarios registrados": "No users registered",
  "Las nuevas playas aparecerán aquí.": "New beaches will appear here.",
  "Los nuevos aeropuertos aparecerán aquí.": "New airports will appear here.",
  "Los nuevos hoteles aparecerán aquí.": "New hotels will appear here.",
  "Las nuevas atracciones aparecerán aquí.": "New attractions will appear here.",
  "Los nuevos restaurantes aparecerán aquí.": "New restaurants will appear here.",
  "Los nuevos vehículos aparecerán aquí.": "New vehicles will appear here.",
  "Los nuevos yates aparecerán aquí.": "New yachts will appear here.",
  "Los nuevos cupones aparecerán aquí.": "New coupons will appear here.",
  "Tipo de Playa": "Beach Type",
  "Tipo de Atracción": "Attraction Type",
  "Precio por Persona": "Price per Person",
  "Flota Taxis": "Taxi Fleet",
  "Flota de Yates": "Yacht Fleet",
  "Aeropuerto": "Airport",
  "Aeropuertos": "Airports",
  "Hoteles": "Hotels",
  "Playas": "Beaches",
  "Atracciones": "Attractions",
  "Restaurantes": "Restaurants",
  "Vehículos": "Vehicles",
  "Yates": "Yachts",
  "Cupones": "Coupons",
  "Usuarios": "Users",
  "Facturas": "Invoices",
  "Monto": "Amount",
  "Método Pago": "Payment Method",
  "Emisión": "Issued Date",
  "Localizador": "Locator",
  "Pasajeros": "Passengers",
  "Total Pagado": "Total Paid",
  "Fecha Viaje": "Travel Date",
  "Estatus": "Status",
  "Estatus Pago": "Payment Status",
  "Huéspedes": "Guests",
  "Noches": "Nights",
  "Entrada": "Check-in",
  "Salida": "Check-out",
  "Habitación": "Room",
  "Rol": "Role",
  "Permisos": "Permissions",
  "Usuario": "Username",
  "Contraseña": "Password",
  "Nombre Completo": "Full Name",
  "Teléfono": "Phone",
  "Correo": "Email",
  "Rango de Fechas": "Date Range",
  "Exportar": "Export",
  "Filtrar por": "Filter by",
  "Gráficas": "Charts",
  "Ventas": "Sales",
  "Reporte de Ventas": "Sales Report",
  "Logs de Actividad": "Activity Logs",
  "Auditoría": "Audit",
  "Historial": "History",
  "Generar": "Generate",
  "Detalle de Reserva": "Reservation Details",
  "Detalle de Solicitud": "Request Details",
  "Aprobar": "Approve",
  "Rechazar": "Reject",
  "Pendiente": "Pending",
  "Confirmada": "Confirmed",
  "Cancelada": "Cancelled",
  "Gestión de Reservas": "Reservations Management",
  "Listado completo de reservaciones y seguimiento de tours.": "Complete list of reservations and tour tracking.",
  "Todos los Estados": "All Statuses",
  "Es Hoy": "It's Today",
  "Próximas": "Upcoming",
  "Ya Pasaron": "Already Passed",
  "Cliente": "Customer",
  "Tour / Paquete": "Tour / Package",
  "Fecha de Reserva": "Reservation Date",
  "No se encontraron reservas con esos filtros.": "No reservations found with those filters.",
  "Cupón:": "Coupon:",
  "No hay reservas que coincidan.": "No matching reservations found.",
  "Buscar por cliente, email o paquete...": "Search by customer, email or package...",
  "Ya pasó": "Already passed",
  "Mañana": "Tomorrow",
  "Todas las Fechas": "All Dates",
  "Faltan ": "Left ",
  " días": " days",
  "Listado oficial de terminales aéreas en México.": "Official list of air terminals in Mexico.",
  "Buscar por...": "Search by...",
  "Financiero": "Financial",
  "Customers": "Customers",
  "Sales": "Sales",
  "Operational": "Operational",
  "Proveedores": "Suppliers",
  "Marketing": "Marketing",
  "Destinos": "Destinations",
  "BI Estratégico": "Strategic BI",
  "Administrativo": "Administrative",
  "Esta Semana": "This Week",
  "Reportes": "Reports",
  "Reservas Activas": "Active Reservations",
  "Métricas de Conversión y Flujo de Estados": "Conversion Metrics and Status Flow",
  "Tiempo Promedio de Permanencia en Cada Estado": "Average Time in Each Status",
  "Reservas": "Reservations",
  "Evolución de Reservas e Ingresos": "Reservations and Revenue Evolution",
  "Distribución por Estado": "Distribution by Status",
  "Sincronizando...": "Synchronizing...",
  "Sincronizando datos...": "Synchronizing data...",
  "Actualizar": "Refresh",
  "Exportar CSV": "Export CSV",
  "Ocultar Filtros": "Hide Filters",
  "Filtros Avanzados": "Advanced Filters",
  "El código de cupón ya existe.": "The coupon code already exists.",
  "Error al crear cupón": "Error creating coupon",
  "Cupón creado con éxito": "Coupon created successfully",
  "Porcentaje Descuento": "Discount Percentage",
  "Ingresa el código": "Enter the code",
  "Código del Cupón": "Coupon Code"
};

const excludeFromJSQuotes = ["Confirmada", "Pendiente", "Cancelada", "Cotización", "Todos", "Todas", "En curso", "Parcialmente pagada", "Reembolsada", "Finalizada"];

const dictionaryKeys = Object.keys(adminDictionary).sort((a, b) => b.length - a.length);

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
      if (filePath.endsWith('.tsx')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = getFilesRecursively(adminDir);

files.forEach(filePath => {
  if (filePath.includes('Sidebar.tsx') || filePath.includes('layout.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. CHECK IDEMPOTENCY
  if (content.includes("from '@/lib/tr'")) {
    console.log(`Skipping already processed file: ${path.relative(adminDir, filePath)}`);
    return;
  }

  // Verify if it contains any of the dictionary keys
  const hasKeys = dictionaryKeys.some(key => content.includes(key));
  if (!hasKeys) return;

  console.log(`Processing file: ${path.relative(adminDir, filePath)}`);

  // 2. Safely extract and strip any "use client" directives
  content = content.replace(/(['"])use client\1;?\s*/gi, '');

  // Prepend 'use client' and imports strictly at the top of the file
  const importStatement = "'use client';\nimport { useLanguage } from '@/context/LanguageContext';\nimport { tr, setLanguage } from '@/lib/tr';\n";
  content = importStatement + content;

  // 3. Inject language setter inside main component functions
  content = content.replace(/export\s+default\s+function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, (match, fnName, fnArgs) => {
    return `export default function ${fnName}(${fnArgs}) {
  const { language } = useLanguage();
  setLanguage(language);`;
  });

  // 4. Translate dictionary matches (HTML/JSX elements & attributes)
  dictionaryKeys.forEach(key => {
    // A. Replace inside HTML/JSX tags: >key< -> >{tr("key")}<
    const tagRegex = new RegExp(`>(\\s*)${key}(\\s*)<`, 'g');
    content = content.replace(tagRegex, `>$1{tr("${key}")}$2<`);

    // B. Replace exact attributes like anyAttr="key" -> anyAttr={tr("key")}
    const attrRegex = new RegExp(`(\\w+)\\s*=\\s*"(${key})"`, 'g');
    content = content.replace(attrRegex, `$1={tr("$2")}`);

    const attrRegexSingle = new RegExp(`(\\w+)\\s*=\\s*'(${key})'`, 'g');
    content = content.replace(attrRegexSingle, `$1={tr("$2")}`);

    // C. Replace in Javascript values/expressions if not in exclusion list
    if (!excludeFromJSQuotes.includes(key)) {
      const doubleQuoteRegex = new RegExp(`(?<!\\/|@|=)\\s*"${key}"(?!:|\\/)`, 'g');
      content = content.replace(doubleQuoteRegex, `tr("${key}")`);

      const singleQuoteRegex = new RegExp(`(?<!\\/|@|=)\\s*'${key}'(?!:|\\/)`, 'g');
      content = content.replace(singleQuoteRegex, `tr("${key}")`);
    }
  });

  // 5. Clean up any accidental double wrappers tr(tr("...")) or tr(tr('...'))
  content = content.replace(/tr\(tr\("([^"]+)"\)\)/g, 'tr("$1")');
  content = content.replace(/tr\(tr\('([^']+)'\)\)/g, 'tr("$1")');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Successfully translated ${filePath}`);
  }
});
