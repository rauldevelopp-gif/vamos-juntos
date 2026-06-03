'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const translationMap: Record<string, string> = {
  // Page titles and headers
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
  
  // Dashboard & Reports
  "Panel de Administración": "Administration Panel",
  "Reportes Administrativos": "Administrative Reports",
  "Super Reportes Administrativos": "Super Administrative Reports",
  "Control de Reservas de Clientes": "Customer Reservations Control",
  "Control de Reservas de Hotel": "Hotel Reservations Control",
  "Solicitudes de Cotización": "Custom Quote Requests",
  "Gestión de Usuarios y Roles": "Users and Roles Management",
  "Facturación y Pagos": "Billing and Payments",
  
  "Reservas Totales": "Total Reservations",
  "Ingresos Generados": "Revenue Generated",
  "Reservas Hoy": "Reservations Today",
  "Nuevos Clientes": "New Customers",
  "Tasa Conversión": "Conversion Rate",
  "Servicios Disp.": "Available Services",
  "Serv. Ocupados": "Occupied Services",
  "Cancelaciones": "Cancellations",
  "Ticket Promedio": "Average Ticket",
  "Destino Top": "Top Destination",
  "Conductor Top": "Top Driver",
  "Yate Top": "Top Yacht",
  "Rte. Top": "Top Restaurant",
  "Bienvenido": "Welcome",
  "Administrador": "Administrator",
  "a su panel de control y estadísticas.": "to your control panel and statistics.",
  "Cargando métricas…": "Loading metrics...",
  
  // Shared actions and buttons
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
  
  // Table headers and labels
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
  
  // Dynamic alerts
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
  
  // Placeholders/Empty states
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
  
  // Specific terms
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
  
  // Details/Modals
  "Detalle de Reserva": "Reservation Details",
  "Detalle de Solicitud": "Request Details",
  "Aprobar": "Approve",
  "Rechazar": "Reject",
  "Pendiente": "Pending",
  "Confirmada": "Confirmed",
  "Cancelada": "Cancelled",

  // Specific List text strings & placeholders
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
  "Por favor llena todos los campos": "Please fill in all fields",
  "El descuento debe ser un porcentaje entre 1 y 100": "Discount must be a percentage between 1 and 100",
  "Error al crear código": "Error creating code",
  "¿Seguro que deseas eliminar este código?": "Are you sure you want to delete this code?",
  "Error al eliminar": "Error deleting",
  "Gestionar Cupones": "Manage Coupons",
  "Nuevo Código": "New Code",
  "Código Generado Automáticamente": "Automatically Generated Code",
  "Regenerar Código": "Regenerate Code",
  "Porcentaje de Descuento (%)": "Discount Percentage (%)",
  "Ej. 15": "E.g. 15",
  "Crear Código": "Create Code",
  "Códigos Creados": "Created Codes",
  "No hay códigos creados.": "No codes created.",
  "Usado": "Used",
  "Disponible": "Available"
};

export default function AdminTranslator({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEn || !containerRef.current) return;

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        
        // Skip script, style and iframe tags to avoid breaking anything
        if (element.nodeName === 'SCRIPT' || element.nodeName === 'STYLE' || element.nodeName === 'IFRAME') {
          return;
        }

        // Translate placeholders
        const placeholder = element.getAttribute('placeholder');
        if (placeholder) {
          const trimmed = placeholder.trim();
          if (translationMap[trimmed]) {
            element.setAttribute('placeholder', translationMap[trimmed]);
          } else {
            // Partial placeholder translation
            let newPlaceholder = placeholder;
            let modified = false;
            const keys = Object.keys(translationMap).sort((a, b) => b.length - a.length);
            for (const key of keys) {
              if (newPlaceholder.includes(key)) {
                newPlaceholder = newPlaceholder.replace(new RegExp(key, 'g'), translationMap[key]);
                modified = true;
              }
            }
            if (modified) {
              element.setAttribute('placeholder', newPlaceholder);
            }
          }
        }

        // Translate button tooltips/titles
        const title = element.getAttribute('title');
        if (title) {
          const trimmed = title.trim();
          if (translationMap[trimmed]) {
            element.setAttribute('title', translationMap[trimmed]);
          }
        }

        // Continue to children
        element.childNodes.forEach(translateNode);
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue || '';
        const trimmed = text.trim();
        if (!trimmed) return;

        // Try exact phrase matching first
        if (translationMap[trimmed]) {
          node.nodeValue = text.replace(trimmed, translationMap[trimmed]);
          return;
        }

        // Try partial translations (matching larger segments first)
        let newText = text;
        let modified = false;
        
        const keys = Object.keys(translationMap).sort((a, b) => b.length - a.length);
        
        for (const key of keys) {
          if (newText.includes(key)) {
            const regex = new RegExp(key, 'g');
            newText = newText.replace(regex, translationMap[key]);
            modified = true;
          }
        }

        if (modified) {
          node.nodeValue = newText;
        }
      }
    };

    // Initial translation pass
    translateNode(containerRef.current);

    // MutationObserver to translate dynamically rendered elements (tables, charts, modals)
    const observer = new MutationObserver((mutations) => {
      let shouldTranslate = false;
      mutations.forEach((mut) => {
        if (mut.type === 'childList') {
          mut.addedNodes.forEach((node) => {
            translateNode(node);
          });
        } else if (mut.type === 'characterData') {
          const text = mut.target.nodeValue || '';
          const trimmed = text.trim();
          // Verify if it needs translation and hasn't been translated already
          if (trimmed && Object.keys(translationMap).some(key => trimmed.includes(key) && !Object.values(translationMap).includes(trimmed))) {
            shouldTranslate = true;
          }
        }
      });

      if (shouldTranslate) {
        observer.disconnect();
        translateNode(containerRef.current!);
        observer.observe(containerRef.current!, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [isEn, language]);

  return <div ref={containerRef} style={{ display: 'contents' }}>{children}</div>;
}
