"use client";
import { useState, useEffect } from 'react';
import { Link } from '../../navigation';
import Image from 'next/image';
import { Compass, Info, ArrowRight, Settings, Sparkles, Image as ImageIcon, Loader2, Plus, Star, ChevronLeft, ChevronRight, Headphones, Award, CalendarDays } from 'lucide-react';
import Testimonials from '../../components/Testimonials';
import { getPackages, getPublicPackages } from './admin/package/actions';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { BookingWizard, SuccessStep } from './packages/components/BookingWizard';
import { getTranslatedValue } from '../../lib/i18n-utils';
import { TourPackage, Booking } from './packages/types';
import { PackageDetail } from './packages/components/PackageDetail';
import Carousel from '../../components/Carousel';
import EntityGrid from '../../components/EntityGrid';
import ExploreMap from '../../components/ExploreMap';
import { getPublicYachts } from './admin/yachts/actions';
import { getPublicBeaches } from './admin/beaches/actions';
import { getPublicAttractions } from './admin/attractions/actions';
import { getPublicHotels } from './hotels/actions';
import { getAboutUsContentAction } from './admin/about-admin/actions';

import HotelCard, { WhatsAppIcon } from '../../components/HotelCard';

interface PackageItem {
    id: string;
    itemId: number;
    type: string;
    name: string;
    price: number;
    order: number;
}

interface Package {
    id: number;
    name: string;
    description?: string;
    status: string;
    price: number;
    sales: number;
    date: string;
    image: string | null;
    items?: PackageItem[] | string;
    driverId?: number;
    total?: number;
    driver?: {
        id: number;
        name: string;
        photo: string | null;
        taxis?: { model: string }[];
        phone?: string;
    };
    createdAt: Date;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const mapApiToFrontend = (apiPkg: any, locale: string): TourPackage => {
  const items = Array.isArray(apiPkg.items) 
    ? apiPkg.items 
    : (typeof apiPkg.items === 'string' ? JSON.parse(apiPkg.items) : []);

  return {
    id: apiPkg.id,
    name: getTranslatedValue(apiPkg.name, locale) || 'Sin nombre',
    description: getTranslatedValue(apiPkg.description, locale) || 'Experiencia exclusiva diseñada para ti.',
    image: apiPkg.image || '/mexico_luxury_ruins_hero_1778020263723.png',
    duration: apiPkg.duration || '8 Horas',
    startTime: apiPkg.start_time || '08:00',
    price: apiPkg.price || 0,
    maxPassengers: apiPkg.vehicle?.capacity || 8,
    pickup: { id: 1, name: apiPkg.pickup || 'Punto de partida', type: 'airport' },
    dropoff: { id: 2, name: apiPkg.dropoff || 'Punto de destino', type: 'hotel' },
    vehicle: { id: apiPkg.vehicle?.id || 1, name: apiPkg.vehicle?.model || 'Luxury SUV', type: 'Premium', capacity: apiPkg.vehicle?.capacity || 8 },
    driver: { id: apiPkg.driver?.id || 1, name: apiPkg.driver?.name || 'Driver VIP' },
    owner: apiPkg.user ? { name: apiPkg.user.name, email: apiPkg.user.email, role: apiPkg.user.role, slug: slugify(apiPkg.user.name) } : undefined,
    items: items.map((item: { name?: string; type?: string } | string, idx: number) => ({
        id: idx,
        name: (typeof item === 'string' ? item : item.name) || 'Item',
        type: (typeof item === 'string' ? 'atraccion' : item.type) || 'atraccion'
    }))
  };
};



export default function Home() {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [packages, setPackages] = useState<Package[]>([]);
  const [yachts, setYachts] = useState<any[]>([]);
  const [beaches, setBeaches] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<TourPackage | null>(null);
  const [bookingPkg, setBookingPkg] = useState<TourPackage | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [aboutUs, setAboutUs] = useState<any>(null);

  const translatedPackages = packages.map(pkg => ({
    ...pkg,
    name: getTranslatedValue(pkg.name, language),
    description: getTranslatedValue(pkg.description, language)
  }));

  const translatedHotels = hotels.map(h => ({
    ...h,
    name: getTranslatedValue(h.name, language),
    description: getTranslatedValue(h.description, language),
    category: getTranslatedValue(h.category, language)
  }));

  const translatedYachts = yachts.map(y => ({
    ...y,
    name: getTranslatedValue(y.name, language),
    description_long: getTranslatedValue(y.description_long, language)
  }));

  const translatedBeaches = beaches.map(b => ({
    ...b,
    name: getTranslatedValue(b.name, language),
    description_long: getTranslatedValue(b.description_long, language)
  }));

  const translatedAttractions = attractions.map(a => ({
    ...a,
    name: getTranslatedValue(a.name, language),
    description_long: getTranslatedValue(a.description_long, language)
  }));

  const parseCoords = (coordsStr: string) => {
      if (!coordsStr) return null;
      const parts = coordsStr.split(',');
      if (parts.length === 2) {
          const lat = parseFloat(parts[0].trim());
          const lng = parseFloat(parts[1].trim());
          if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      }
      return null;
  };

  const mapLocations: any[] = [];
  translatedHotels.forEach(h => {
      const coords = parseCoords(h.coordinates);
      if (coords) {
          const startingPrice = h.rooms?.length > 0 ? Math.min(...h.rooms.map((r: any) => r.basePrice)) : 0;
          mapLocations.push({
              id: `hotel-${h.id}`,
              lat: coords.lat,
              lng: coords.lng,
              title: h.name,
              descEs: h.description || h.location,
              descEn: h.description || h.location,
              typeEs: h.category || 'Hotel',
              typeEn: h.category || 'Hotel',
              price: startingPrice > 0 ? formatPrice(startingPrice) : '',
              link: `/hotels/${h.id}`
          });
      }
  });
  translatedAttractions.forEach(a => {
      const coords = parseCoords(a.coordinates);
      if (coords) {
          mapLocations.push({
              id: `attr-${a.id}`,
              lat: coords.lat,
              lng: coords.lng,
              title: a.name,
              descEs: a.description_long || '',
              descEn: a.description_long || '',
              typeEs: a.category || 'Atracción',
              typeEn: 'Attraction',
              price: a.price > 0 ? formatPrice(a.price) : 'Gratis',
              link: `/packages`
          });
      }
  });
  translatedYachts.forEach(y => {
      const coords = parseCoords(y.coordinates);
      if (coords) {
          mapLocations.push({
              id: `yacht-${y.id}`,
              lat: coords.lat,
              lng: coords.lng,
              title: y.name,
              descEs: y.description_long || '',
              descEn: y.description_long || '',
              typeEs: 'Yate',
              typeEn: 'Yacht',
              price: y.price_day > 0 ? formatPrice(y.price_day) : '',
              link: `/packages`
          });
      }
  });
  translatedBeaches.forEach(b => {
      const coords = parseCoords(b.coordinates);
      if (coords) {
          mapLocations.push({
              id: `beach-${b.id}`,
              lat: coords.lat,
              lng: coords.lng,
              title: b.name,
              descEs: b.description_long || '',
              descEn: b.description_long || '',
              typeEs: 'Playa',
              typeEn: 'Beach',
              price: 'Acceso Libre',
              link: `/packages`
          });
      }
  });

  useEffect(() => {
    const fetchData = async () => {
      const [pkgRes, yachtRes, beachRes, attrRes, hotelRes, aboutUsRes] = await Promise.all([
        getPublicPackages(),
        getPublicYachts(),
        getPublicBeaches(),
        getPublicAttractions(),
        getPublicHotels(),
        getAboutUsContentAction()
      ]);
      
      if (pkgRes.success && pkgRes.data) setPackages(pkgRes.data.slice(0, 6));
      if (yachtRes.success && yachtRes.data) setYachts(yachtRes.data);
      if (beachRes.success && beachRes.data) setBeaches(beachRes.data);
      if (attrRes.success && attrRes.data) setAttractions(attrRes.data);
      if (hotelRes.success && hotelRes.data) setHotels(hotelRes.data);
      
      if (aboutUsRes.success && aboutUsRes.data && aboutUsRes.data.status === 'PUBLISHED') {
        setAboutUs(aboutUsRes.data);
      }
      
      setLoading(false);
    };
    fetchData();
  }, []);
  if (confirmedBooking) {
    return <SuccessStep booking={confirmedBooking} onReset={() => setConfirmedBooking(null)} />;
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-banner" style={{ display: 'block', height: 'auto', minHeight: '80vh' }}>
        <div className="hero-overlay"></div>
        <Image
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Yacht"
          fill
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          unoptimized
        />
        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4rem 2rem 5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/packages" className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Compass size={20} strokeWidth={2} />
              <span>{t('btn_explore')}</span>
              <Sparkles size={16} strokeWidth={2} />
            </Link>
            <Link href="/build" className="btn-glass-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)' }}>
              <Plus size={20} strokeWidth={2} />
              <span>{t('btn_build')}</span>
            </Link>
          </div>
          <h1 className="heading-1 float-animation" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)', lineHeight: '1.1' }}>
            {t('hero_title_1')} <br /><span className="text-gradient">{t('hero_title_2')}</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: '1.6' }}>
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Why book with VamosJuntos Section */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-glass)' }}>
        <div className="container">
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <h2 className="heading-1 float-animation" style={{ fontSize: '2.5rem', textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
              {t('why_book_title')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            
            {/* Item 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="float-animation" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', marginBottom: '0.5rem', boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.2)' }}>
                <Headphones size={36} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('why_book_1_title')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '280px' }}>
                {t('why_book_1_desc')}
              </p>
            </div>

            {/* Item 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="float-animation" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '0.5rem', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.2)', animationDelay: '0.2s' }}>
                <Sparkles size={36} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('why_book_2_title')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '280px' }}>
                {t('why_book_2_desc')}
              </p>
            </div>

            {/* Item 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="float-animation" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', marginBottom: '0.5rem', boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.2)', animationDelay: '0.4s' }}>
                <Award size={36} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('why_book_3_title')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '280px' }}>
                {t('why_book_3_desc')}
              </p>
            </div>

            {/* Item 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="float-animation" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', marginBottom: '0.5rem', boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.2)', animationDelay: '0.6s' }}>
                <Compass size={36} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('why_book_4_title')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '280px' }}>
                {t('why_book_4_desc')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Explore Map Section */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border-glass)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="heading-1 float-animation" style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
              {language === 'en' ? "Explore the Luxury Caribbean" : "Explora el Caribe de Lujo"}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              {language === 'en' 
                  ? "Discover the Riviera Maya through our interactive booking map." 
                  : "Descubre la Riviera Maya a través de nuestro mapa interactivo de reservas."}
            </p>
          </div>
          <ExploreMap locations={mapLocations} />
        </div>
      </section>

      {/* Featured Packages */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="heading-1 float-animation" style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
              <span className="text-gradient">{t('featured_packages')}</span> {t('featured_packages_bold')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              {t('featured_subtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 className="animate-spin" color="var(--primary)" size={32} />
                </div>
              ))
            ) : translatedPackages.map((pkg) => (
              <div key={pkg.id} className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ height: '220px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                  {pkg.image ? (
                    <Image 
                        src={pkg.image} 
                        alt={pkg.name} 
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon size={48} opacity={0.1} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
                    {t('exclusive')}
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pkg.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', height: '3rem', overflow: 'hidden' }}>
                    {pkg.description || '...'}
                  </p>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{formatPrice(pkg.price)}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setSelectedPkg(mapApiToFrontend(pkg, language))}
                        className="btn-secondary" 
                        style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title={t('details')}
                      >
                        <Info size={16} />
                      </button>
                      <a 
                        href={`https://wa.me/${pkg.driver?.phone?.replace(/\D/g, '') || '529981234567'}?text=${encodeURIComponent(`Hola, necesito más información sobre el paquete: ${pkg.name}.\nPuedes verlo aquí: ${typeof window !== 'undefined' ? window.location.origin : ''}/packages?reserve=${pkg.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.6rem', borderRadius: '12px', background: '#25d366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', border: 'none' }}
                        title="Contactar por WhatsApp"
                      >
                        <WhatsAppIcon size={16} />
                      </a>
                      <button 
                        onClick={() => setBookingPkg(mapApiToFrontend(pkg, language))}
                        className="btn-premium" 
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'center' }}
                      >
                        {t('reserve_title')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/packages" className="btn-premium" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'inline-block', borderRadius: '50px' }}>
              {t('view_all_destinations')}
            </Link>
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="heading-1 float-animation" style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
              <span className="text-gradient">{t('hotels_title')}</span> {t('hotels_title_bold')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              {t('hotels_subtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 className="animate-spin" color="#8b5cf6" size={32} />
                </div>
              ))
            ) : translatedHotels.slice(0, 6).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/hotels" className="btn-premium" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'inline-block', borderRadius: '50px' }}>
              {t('view_all_hotels')}
            </Link>
          </div>
        </div>
      </section>

      {/* Yachts Grid */}
      <EntityGrid 
        title={<><span className="text-gradient">{t('yachts_title')}</span> {t('yachts_title_bold')}</>} 
        subtitle={t('yachts_subtitle')} 
        items={translatedYachts.slice(0, 9)} 
        viewMoreLink="/yachts"
        viewMoreText={t('view_all_yachts')}
        accentColor="var(--secondary)"
      />

      {/* Beaches Grid */}
      <EntityGrid 
        title={<>{t('beaches_title')} <span className="text-gradient">{t('beaches_title_bold')}</span></>} 
        subtitle={t('beaches_subtitle')} 
        items={translatedBeaches.slice(0, 9)} 
        viewMoreLink="/beaches"
        viewMoreText={t('view_all_beaches')}
        accentColor="#10b981"
      />

      {/* Attractions Grid */}
      <EntityGrid 
        title={<>{t('attractions_title')} <span className="text-gradient">{t('attractions_title_bold')}</span></>} 
        subtitle={t('attractions_subtitle')} 
        items={translatedAttractions.slice(0, 9)} 
        viewMoreLink="/attractions"
        viewMoreText={t('view_all_attractions')}
        accentColor="var(--accent)"
      />

      {/* Dynamic Quiénes Somos Section */}
      {aboutUs && (
        <section style={{ padding: '6rem 0', background: 'rgba(5, 7, 10, 0.4)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }} className="quienes-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '50px', color: '#c4b5fd', fontWeight: 600, fontSize: '0.8rem', width: 'fit-content', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <Info size={14} /> {t('about_title_accent')}
                </div>
                <h2 className="heading-1" style={{ fontSize: '2.8rem', lineHeight: '1.1', margin: 0 }}>
                  {aboutUs.title} <br />
                  <span className="text-gradient">{aboutUs.subtitle}</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7', margin: 0 }}>
                  {aboutUs.description?.substring(0, 280)}...
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {aboutUs.stats?.slice(0, 2).map((stat: any) => (
                    <div key={stat.id} className="glass-card" style={{ padding: '1rem 2rem', minWidth: '160px', flex: '1 1 0px' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', display: 'block' }}>
                        {stat.value}{stat.suffix}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <Link href="/quienes-somos" className="btn-premium" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '50px', textDecoration: 'none' }}>
                    <span>{t('about_more_btn')}</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              <div style={{ position: 'relative', height: '420px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                <Image
                  src={aboutUs.heroDesktopImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200'}
                  alt="VamosJuntos Experience"
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,7,10,0.85) 0%, rgba(5,7,10,0.2) 60%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>"{aboutUs.mission || (language === 'en' ? 'Our mission is to design unforgettable premium travel experiences.' : 'Nuestra misión es diseñar experiencias de viaje premium inolvidables.')}"</p>
                  <span style={{ color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', display: 'block', marginTop: '0.5rem' }}>{t('about_mission_tag')}</span>
                </div>
              </div>
            </div>
          </div>
          <style jsx>{`
            @media (max-width: 992px) {
              .quienes-grid {
                grid-template-columns: 1fr !important;
                gap: 2.5rem !important;
              }
            }
          `}</style>
        </section>
      )}

      {/* Testimonials */}
      <Testimonials />

      {/* Partner Registration CTA */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '2rem', minHeight: '500px', display: 'flex', alignItems: 'center', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            
            {/* Background Image */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <Image 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
                alt="Tour Operators" 
                fill 
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                unoptimized
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.8) 50%, transparent 100%)' }}></div>
            </div>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, padding: '4rem', maxWidth: '700px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '50px', color: '#c4b5fd', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2rem' }}>
                  <Sparkles size={16} /> Socios Estratégicos
                </div>
                
                <h2 className="heading-1 float-animation" style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.1', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  {t('partner_cta_title')}
                </h2>
                
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '2.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {t('partner_cta_desc')}
                </p>
                
                <Link href="/register" className="btn-premium" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.5)' }}>
                  {t('btn_register_now')}
                  <ArrowRight size={20} />
                </Link>
            </div>

          </div>
        </div>
      </section>

      {selectedPkg && (
        <PackageDetail 
          pkg={selectedPkg} 
          onClose={() => setSelectedPkg(null)} 
          onContinue={(pkg) => {
            setSelectedPkg(null);
            setBookingPkg(pkg);
          }}
        />
      )}

      {/* Booking Wizard */}
      {bookingPkg && (
        <BookingWizard 
          pkg={bookingPkg}
          onClose={() => setBookingPkg(null)}
          onComplete={(booking) => {
              setBookingPkg(null);
              setConfirmedBooking(booking);
          }}
        />
      )}

      {/* Admin Quick Access (Floating FAB) */}
      <Link href="/login" className="admin-fab">
        <div className="fab-icon-container">
          <Settings size={22} strokeWidth={2.5} />
        </div>
        <span className="fab-text">{t('admin_access')}</span>
      </Link>
    </main>
  );
}
