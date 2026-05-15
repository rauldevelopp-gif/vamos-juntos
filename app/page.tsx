"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Info, ArrowRight, Settings, Sparkles, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { getPackages } from './admin/package/actions';
import { useLanguage } from '../context/LanguageContext';
import { BookingWizard, SuccessStep } from './packages/components/BookingWizard';
import { TourPackage, Booking } from './packages/types';
import { PackageDetail } from './packages/components/PackageDetail';

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
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<TourPackage | null>(null);
  const [bookingPkg, setBookingPkg] = useState<TourPackage | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const result = await getPackages();
      if (result.success && result.data) {
        setPackages(result.data.slice(0, 6));
      }
      setLoading(false);
    };
    fetchPackages();
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

      {/* Partner Registration CTA */}
      <section style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" 
            alt="Partnership" 
            fill 
            style={{ objectFit: 'cover', opacity: 0.15 }}
            unoptimized
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--background), transparent, var(--background))' }}></div>
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <Sparkles size={48} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
            <h2 className="heading-2" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('partner_cta_title')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
              {t('partner_cta_desc')}
            </p>
            <Link href="/register" className="btn-premium" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}>
              {t('btn_register_now')}
              <ArrowRight size={20} />
            </Link>
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
