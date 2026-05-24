"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Info, ArrowRight, Settings, Sparkles, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import Testimonials from '../components/Testimonials';
import { getPackages } from './admin/package/actions';
import { useLanguage } from '../context/LanguageContext';
import { BookingWizard, SuccessStep } from './packages/components/BookingWizard';
import { TourPackage, Booking } from './packages/types';
import { PackageDetail } from './packages/components/PackageDetail';
import Carousel from '../components/Carousel';
import EntityGrid from '../components/EntityGrid';
import { getPublicYachts } from './admin/yachts/actions';
import { getPublicBeaches } from './admin/beaches/actions';
import { getPublicAttractions } from './admin/attractions/actions';

import Image from 'next/image';

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
    };
    createdAt: Date;
}

const mapApiToFrontend = (apiPkg: { 
    id: number;
    name?: string;
    description?: string;
    image?: string | null;
    duration?: string;
    start_time?: string;
    price?: number;
    pickup?: string;
    dropoff?: string;
    vehicle?: { id: number; model: string; capacity: number };
    driver?: { id: number; name: string };
    user?: { name: string; email: string; role: string };
    items?: unknown;
}): TourPackage => {
  const items = Array.isArray(apiPkg.items) 
    ? apiPkg.items 
    : (typeof apiPkg.items === 'string' ? JSON.parse(apiPkg.items) : []);

  return {
    id: apiPkg.id,
    name: apiPkg.name || 'Sin nombre',
    description: apiPkg.description || 'Experiencia exclusiva diseñada para ti.',
    image: apiPkg.image || '/mexico_luxury_ruins_hero_1778020263723.png',
    duration: apiPkg.duration || '8 Horas',
    startTime: apiPkg.start_time || '08:00',
    price: apiPkg.price || 0,
    maxPassengers: apiPkg.vehicle?.capacity || 8,
    pickup: { id: 1, name: apiPkg.pickup || 'Punto de partida', type: 'airport' },
    dropoff: { id: 2, name: apiPkg.dropoff || 'Punto de destino', type: 'hotel' },
    vehicle: { id: apiPkg.vehicle?.id || 1, name: apiPkg.vehicle?.model || 'Luxury SUV', type: 'Premium', capacity: apiPkg.vehicle?.capacity || 8 },
    driver: { id: apiPkg.driver?.id || 1, name: apiPkg.driver?.name || 'Driver VIP' },
    owner: apiPkg.user ? { name: apiPkg.user.name, email: apiPkg.user.email, role: apiPkg.user.role } : undefined,
    items: items.map((item: { name?: string; type?: string } | string, idx: number) => ({
        id: idx,
        name: (typeof item === 'string' ? item : item.name) || 'Item',
        type: (typeof item === 'string' ? 'atraccion' : item.type) || 'atraccion'
    }))
  };
};



export default function Home() {
  const { t } = useLanguage();
  const [packages, setPackages] = useState<Package[]>([]);
  const [yachts, setYachts] = useState<any[]>([]);
  const [beaches, setBeaches] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<TourPackage | null>(null);
  const [bookingPkg, setBookingPkg] = useState<TourPackage | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [pkgRes, yachtRes, beachRes, attrRes] = await Promise.all([
        getPackages(),
        getPublicYachts(),
        getPublicBeaches(),
        getPublicAttractions()
      ]);
      
      if (pkgRes.success && pkgRes.data) setPackages(pkgRes.data.slice(0, 6));
      if (yachtRes.success && yachtRes.data) setYachts(yachtRes.data);
      if (beachRes.success && beachRes.data) setBeaches(beachRes.data);
      if (attrRes.success && attrRes.data) setAttractions(attrRes.data);
      
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

      {/* Featured Packages */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 className="heading-2">{t('featured_packages')}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('featured_subtitle')}</p>
            </div>
            <Link href="/packages" className="link-action" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {t('view_all_destinations')} <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 className="animate-spin" color="var(--primary)" size={32} />
                </div>
              ))
            ) : packages.map((pkg) => (
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
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>${pkg.price?.toLocaleString()} <small style={{ fontSize: '0.7rem', opacity: 0.5 }}>USD</small></span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setSelectedPkg(mapApiToFrontend(pkg))}
                        className="btn-secondary" 
                        style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title={t('details')}
                      >
                        <Info size={16} />
                      </button>
                      <button 
                        onClick={() => setBookingPkg(mapApiToFrontend(pkg))}
                        className="btn-premium" 
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'center' }}
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yachts Grid */}
      <EntityGrid 
        title={<><span className="text-gradient">Flota de Yates</span> Elite</>} 
        subtitle="Navega por las aguas más exclusivas con nuestra colección de embarcaciones de súper lujo." 
        items={yachts.slice(0, 9)} 
        viewMoreLink="/yachts"
        viewMoreText="Ver todos los yates"
        accentColor="var(--secondary)"
      />

      {/* Beaches Grid */}
      <EntityGrid 
        title={<>Paraísos <span className="text-gradient">Costeros</span></>} 
        subtitle="Descubre los destinos de playa más impresionantes, seleccionados cuidadosamente para ti." 
        items={beaches.slice(0, 9)} 
        viewMoreLink="/beaches"
        viewMoreText="Ver todas las playas"
        accentColor="#10b981"
      />

      {/* Attractions Grid */}
      <EntityGrid 
        title={<>Experiencias <span className="text-gradient">Inolvidables</span></>} 
        subtitle="Aventuras y tours mágicos que llevarán tu viaje al siguiente nivel." 
        items={attractions.slice(0, 9)} 
        viewMoreLink="/attractions"
        viewMoreText="Ver todas las atracciones"
        accentColor="var(--accent)"
      />

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
