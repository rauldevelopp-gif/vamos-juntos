import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session || session.value !== 'admin_session_token') {
        redirect('/login');
    }

    return (
        <div className="admin-layout-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
            {/* CSS to hide public header when in admin */}
            <style dangerouslySetInnerHTML={{ __html: `
                body > header { display: none !important; }
                body > main { padding-top: 0 !important; }
                body > footer { display: none !important; }
            `}} />

            {/* Mobile Admin Header */}
            <header className="admin-mobile-header glass-panel" style={{
                display: 'none', // Shown via CSS
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                zIndex: 1100,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem',
                borderRadius: 0,
                borderBottom: '1px solid var(--border-glass)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '0.8rem' }}>V</div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }} className="text-gradient">Admin</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
                        <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }} title="Cerrar Sesión">
                            <LogOut size={20} strokeWidth={2} />
                        </button>
                    </form>
                    {/* The Hamburger button is inside the Sidebar component but we can adjust its position */}
                </div>
            </header>

            <Sidebar />

            {/* Main Content */}
            <main className="main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {children}
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 768px) {
                    .admin-mobile-header {
                        display: flex !important;
                    }
                    .main-content {
                        padding-top: 80px !important; /* Space for the mobile header */
                    }
                    .admin-layout-container {
                        flex-direction: column !important;
                    }
                }
            `}} />
        </div>
    );
}
