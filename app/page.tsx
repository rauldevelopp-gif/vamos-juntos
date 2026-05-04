"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Compass, Info, ArrowRight, Settings, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-banner" style={{ display: 'block', height: 'auto', minHeight: '80vh' }}>
        <div className="hero-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Yacht"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4rem 2rem 5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/packages" className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Compass size={20} strokeWidth={2} />
              <span>Explorar Paquetes</span>
              <Sparkles size={16} strokeWidth={2} />
            </Link>
          </div>
          <h1 className="heading-1 float-animation" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)', lineHeight: '1.1' }}>
            Experiencia de <br /><span className="text-gradient">Lujo a la Medida</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: '1.6' }}>
            Accede a la selección más exclusiva de yates, transporte VIP y gastronomía premium. Creamos momentos inolvidables diseñados solo para ti.
          </p>
        </div>
      </section>

      {/* Featured Packages */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 className="heading-2">Paquetes Destacados</h2>
              <p style={{ color: 'var(--text-muted)' }}>Selecciones exclusivas para tu próximo viaje</p>
            </div>
            <Link href="/packages" className="link-action" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Ver todos los destinos <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Escapada de Lujo - Cancún', price: '$1,200', image: '/cancun_luxury_resort_1777913412420.png', desc: 'Resort 5 estrellas, transporte VIP y experiencias exclusivas frente al mar.' },
              { name: 'Aventura en la Selva', price: '$850', image: '/jungle_adventure_cenote_1777913424869.png', desc: 'Exploración de cenotes, guías certificados y equipo de aventura premium.' },
              { name: 'Tour Gastronómico VIP', price: '$600', image: '/vip_gastronomy_tour_1777913439696.png', desc: 'Cata de vinos, menú degustación de autor y los mejores chefs de México.' }
            ].map((pkg, i) => (
              <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ height: '220px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                  <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
                    Populares
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{pkg.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {pkg.desc}
                  </p>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{pkg.price}</span>
                    <button className="btn-premium" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Info size={16} />
                      Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Quick Access (Floating FAB) */}
      <Link href="/login" className="admin-fab">
        <div className="fab-icon-container">
          <Settings size={22} strokeWidth={2.5} />
        </div>
        <span className="fab-text">Acceso Admin</span>
      </Link>
    </main>
  );
}
