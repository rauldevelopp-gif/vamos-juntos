import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VamosJuntos - Travel Packages",
  description: "Create and book dynamic travel packages effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header style={{
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }} className="text-gradient">VamosJuntos</h1>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/">Home</a>
              <a href="/packages">Paquetes</a>
              <a href="/admin">Admin Hub</a>
            </nav>
          </div>
        </header>

        <main style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 0' }}>
          {children}
        </main>

        <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: '2rem 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} VamosJuntos. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
