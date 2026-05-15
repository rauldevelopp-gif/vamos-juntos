'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

const translations = {
    es: {
        // Navbar
        nav_home: "Inicio",
        nav_packages: "Paquetes",
        nav_tracking: "Seguimiento",
        nav_login: "Entrar",
        nav_logout: "Salir",
        
        // Home
        hero_title_1: "Experiencia de",
        hero_title_2: "Lujo a la Medida",
        hero_subtitle: "Accede a la selección más exclusiva de yates, transporte VIP y gastronomía premium. Creamos momentos inolvidables diseñados solo para ti.",
        btn_explore: "Explorar Paquetes",
        btn_build: "Construir Paquete",
        featured_packages: "Paquetes Destacados",
        featured_subtitle: "Selecciones exclusivas para tu próximo viaje",
        view_all_destinations: "Ver todos los destinos",
        exclusive: "Exclusivo",
        details: "Detalles",
        loading_packages: "Cargando paquetes...",
        
        // Flyer / Shared
        total_investment: "INVERSIÓN TOTAL",
        reserve_concierge: "Reserva con tu Concierge",
        selected_itinerary: "ITINERARIO SELECTO",
        assigned_driver: "CHOFER ASIGNADO",
        custom_package_flyer: "TU PAQUETE PERSONALIZADO",
        client_request_flyer: "SOLICITUD DE CLIENTE",
        itinerary_flyer: "TU ITINERARIO",
        estimated_price: "PRECIO ESTIMADO",
        package_promotional: "Paquete promocional directo.",
        brand_name: "VAMOS JUNTOS",
        brand_footer_note: "Vamos Juntos Luxury",
        driver_vip: "Chofer VIP",
        
        // Tracking page
        my_requests: "Mis Solicitudes",
        tracking_subtitle: "Seguimiento en tiempo real de tus paquetes personalizados.",
        syncing_status: "Sincronizando estado...",
        no_active_requests: "No tienes solicitudes activas",
        no_requests_desc: "Empieza por construir tu primer paquete personalizado.",
        status_pending: "Pendiente",
        status_confirmed: "Confirmado",
        request_confirmed_title: "¡Solicitud Confirmada!",
        request_confirmed_desc: "Un conductor ha aceptado tu paquete. Revisa los detalles abajo.",
        created_at: "Creado el",
        current_status: "Estado actual:",
        driver_confirmed_flyer: "CHOFER CONFIRMADO",
        request_approved_flyer: "✓ Solicitud Aprobada",
        
        // Builder page
        package_builder_title: "Constructor de Paquetes",
        package_builder_desc: "Diseña experiencias únicas compuestas por múltiples servicios",
        saving: "Guardando...",
        loading: "Cargando...",
        driver_confirmation_label: "Confirmación de Chofer",
        driver_confirmation_note_1: "Al ser un paquete personalizado, quedará",
        driver_confirmation_note_2: "pendiente de confirmación",
        driver_confirmation_note_3: "por parte de un conductor profesional una vez que lo guardes.",
        package_name_label: "Nombre del Paquete",
        package_name_placeholder: "Ej: Luxury Cancun Experience",
        description_label: "Descripción",
        description_placeholder: "Detalla qué incluye este paquete...",
        package_itinerary_title: "Itinerario del Paquete",
        package_itinerary_desc: "Gestiona la secuencia de servicios",
        services_count: "Servicios",
        builder_empty_state: "Selecciona una categoría arriba para empezar a construir",
        total_price_label: "Precio Total",
        btn_preview: "Vista Previa",
        btn_save_package: "Guardar Paquete",
        alert_assign_name: "Asigna un nombre al paquete",
        package_saved_notif: "¡Paquete Guardado!",
        alert_critical_error: "Error crítico al guardar",
        rating_label: "Rating",
        confirm_selection: "Confirmar Selección",
        start_date_label: "Fecha de Inicio",
        start_time_label: "Hora de Inicio",
        
        // Catalog Modal
        airports: "Vuelos/Aeropuertos",
        hotels: "Hoteles",
        restaurants: "Restaurantes",
        beaches: "Playas",
        attractions: "Atracciones",
        yachts: "Yates/Marina",
        catalog_explore: "Explora el catálogo de",
        search: "Buscar",
        syncing_catalog: "Sincronizando catálogo...",
        no_items_found: "No se encontraron",
        
        // Registration
        partner_cta_title: "¿Eres Operador o Transportista?",
        partner_cta_desc: "Únete a la red más exclusiva de servicios de lujo. Expande tu alcance y gestiona tus servicios con nuestra tecnología premium.",
        btn_register_now: "Registrarme Ahora",
        reg_title: "Registro de Socios",
        reg_subtitle: "Completa el formulario para unirte a nuestra red",
        full_name: "Nombre Completo",
        address: "Dirección",
        country: "País",
        phone: "Teléfono",
        email: "Correo Electrónico",
        user_type: "Tipo de Usuario",
        operator: "Operador",
        transporter: "Transportista",
        btn_submit_reg: "Enviar Registro",
        reg_success: "¡Registro enviado con éxito! Nos pondremos en contacto pronto.",
        back_to_site: "Volver al sitio"
    },
    en: {
        // Navbar
        nav_home: "Home",
        nav_packages: "Packages",
        nav_tracking: "Tracking",
        nav_login: "Login",
        nav_logout: "Logout",
        
        // Home
        hero_title_1: "Tailored",
        hero_title_2: "Luxury Experience",
        hero_subtitle: "Access the most exclusive selection of yachts, VIP transport, and premium gastronomy. We create unforgettable moments designed just for you.",
        btn_explore: "Explore Packages",
        btn_build: "Build Package",
        featured_packages: "Featured Packages",
        featured_subtitle: "Exclusive selections for your next trip",
        view_all_destinations: "View all destinations",
        exclusive: "Exclusive",
        details: "Details",
        loading_packages: "Loading packages...",
        
        // Flyer / Shared
        total_investment: "TOTAL INVESTMENT",
        reserve_concierge: "Book with your Concierge",
        selected_itinerary: "SELECTED ITINERARY",
        assigned_driver: "ASSIGNED DRIVER",
        custom_package_flyer: "YOUR PERSONALIZED PACKAGE",
        client_request_flyer: "CLIENT REQUEST",
        itinerary_flyer: "YOUR ITINERARY",
        estimated_price: "ESTIMATED PRICE",
        package_promotional: "Direct promotional package.",
        brand_name: "VAMOS JUNTOS",
        brand_footer_note: "Vamos Juntos Luxury",
        driver_vip: "VIP Driver",
        
        // Tracking page
        my_requests: "My Requests",
        tracking_subtitle: "Real-time tracking of your personalized packages.",
        syncing_status: "Syncing status...",
        no_active_requests: "You have no active requests",
        no_requests_desc: "Start by building your first personalized package.",
        status_pending: "Pending",
        status_confirmed: "Confirmed",
        request_confirmed_title: "Request Confirmed!",
        request_confirmed_desc: "A driver has accepted your package. Review the details below.",
        created_at: "Created on",
        current_status: "Current status:",
        driver_confirmed_flyer: "CONFIRMED DRIVER",
        request_approved_flyer: "✓ Request Approved",
        
        // Builder page
        package_builder_title: "Package Builder",
        package_builder_desc: "Design unique experiences composed of multiple services",
        saving: "Saving...",
        loading: "Loading...",
        driver_confirmation_label: "Driver Confirmation",
        driver_confirmation_note_1: "As a personalized package, it will be",
        driver_confirmation_note_2: "pending confirmation",
        driver_confirmation_note_3: "from a professional driver once you save it.",
        package_name_label: "Package Name",
        package_name_placeholder: "e.g., Luxury Cancun Experience",
        description_label: "Description",
        description_placeholder: "Detail what this package includes...",
        package_itinerary_title: "Package Itinerary",
        package_itinerary_desc: "Manage the sequence of services",
        services_count: "Services",
        builder_empty_state: "Select a category above to start building",
        total_price_label: "Total Price",
        btn_preview: "Preview",
        btn_save_package: "Save Package",
        alert_assign_name: "Assign a name to the package",
        package_saved_notif: "Package Saved!",
        alert_critical_error: "Critical save error",
        rating_label: "Rating",
        confirm_selection: "Confirm Selection",
        start_date_label: "Start Date",
        start_time_label: "Start Time",
        
        // Catalog Modal
        airports: "Flights/Airports",
        hotels: "Hotels",
        restaurants: "Restaurants",
        beaches: "Beaches",
        attractions: "Attractions",
        yachts: "Yachts/Marina",
        catalog_explore: "Explore the catalog of",
        search: "Search",
        syncing_catalog: "Syncing catalog...",
        no_items_found: "No items found for",
        
        // Registration
        partner_cta_title: "Are you an Operator or Transporter?",
        partner_cta_desc: "Join the most exclusive luxury service network. Expand your reach and manage your services with our premium technology.",
        btn_register_now: "Register Now",
        reg_title: "Partner Registration",
        reg_subtitle: "Complete the form to join our network",
        full_name: "Full Name",
        address: "Address",
        country: "Country",
        phone: "Phone",
        email: "Email Address",
        user_type: "User Type",
        operator: "Operator",
        transporter: "Transporter",
        btn_submit_reg: "Submit Registration",
        reg_success: "Registration submitted successfully! We will contact you soon.",
        back_to_site: "Back to site"
    }
};

export type TranslationKey = keyof typeof translations.es;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('es');

    useEffect(() => {
        const savedLang = localStorage.getItem('vamosJuntos_lang') as Language;
        if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('vamosJuntos_lang', lang);
    };

    const t = (key: TranslationKey): string => {
        const dictionary = translations[language] || translations['es'];
        return (dictionary as any)[key] || (translations['es'] as any)[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
