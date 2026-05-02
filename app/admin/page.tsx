export default function AdminDashboard() {
    return (
        <div className="container">
            <h1 className="heading-1" style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
                Manage all the providers, vehicles, yachts, places, and restaurants in the system.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                {[
                    { name: 'Taxis & Drivers', path: '/admin/taxis' },
                    { name: 'Yachts', path: '/admin/yachts' },
                    { name: 'Restaurants', path: '/admin/restaurants' },
                    { name: 'Tourist Places', path: '/admin/places' },
                    { name: 'Reservations', path: '/admin/reservations' }
                ].map(item => (
                    <a key={item.name} href={item.path} style={{
                        display: 'block',
                        padding: '2rem',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.2s'
                    }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{item.name}</h2>
                        <div style={{ marginTop: '1rem', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 500 }}>
                            Manage &rarr;
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
