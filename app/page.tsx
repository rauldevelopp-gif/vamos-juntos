import Image from 'next/image';
import Link from 'next/link';

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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/packages" className="btn-premium" style={{ padding: '1rem 3rem' }}>
              Ver Paquetes
            </Link>
          </div>
          <h1 className="heading-1 float-animation" style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            Vive la experiencia <span className="text-gradient">Premium</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Descubre paquetes exclusivos de yates, hoteles y experiencias diseñadas para los más exigentes.
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
            <Link href="/packages" style={{ color: 'var(--primary)', fontWeight: 500 }}>
              Ver todos &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {/* Sample Package Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
                    Populares
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Escapada de Lujo {i}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Incluye transporte VIP, estadía en hotel 5 estrellas y tour privado en yate.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>$1,200</span>
                    <button className="btn-premium" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Detalles</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Quick Access (Floating Fixed) */}
      <Link href="/login" style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        ⚙️
      </Link>
    </main>
  );
}
