import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 0',
        textAlign: 'center',
        minHeight: '70vh'
      }}>
        <h1 className="heading-1">
          Create Your Dream <span className="text-gradient">Travel Package</span>
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-muted)',
          maxWidth: '600px',
          marginBottom: '2.5rem',
          lineHeight: 1.6
        }}>
          Customize every detail of your trip. Select yachts, private taxis, top-tier restaurants, and local excursions instantly.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/packages">
            <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '0.8rem 2rem' }}>
              Start Building Now
            </button>
          </Link>
          <Link href="/admin">
            <button style={{
              background: 'transparent',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '0.8rem 2rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '1.1rem',
              fontWeight: 500
            }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--border-color)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Service Providers
            </button>
          </Link>
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '3rem' }}>Everything You Need</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {[
            { tag: '🌊', title: 'Yachts & Beaches', desc: 'Book private yachts and exclusive beach spots.' },
            { tag: '🚕', title: 'Private Transport', desc: 'Secure reliable taxis and drivers at your disposal.' },
            { tag: '🍽️', title: 'Premium Dining', desc: 'Reserve tables at highly-rated local restaurants.' },
            { tag: '🗺️', title: 'Excursions', desc: 'Guided tours and access to popular monuments.' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.tag}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
