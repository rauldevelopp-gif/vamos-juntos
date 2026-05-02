import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = cookies().get('session');

    if (!session || session.value !== 'admin_session_token') {
        redirect('/login');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside className="glass-panel" style={{ width: '280px', margin: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Confort VIP</h2>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <a href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>Dashboard</a>
                    <a href="/admin/build" style={{ padding: '0.75rem 1rem', color: 'var(--accent)', fontWeight: 600 }}>Build Package 🛠️</a>
                    <a href="/admin/packages" style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Paquetes</a>
                    <a href="/admin/taxis" style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Flota Taxis</a>
                    <a href="/admin/yachts" style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Yates</a>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <a href="/" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>Cerrar Sesión</a>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
