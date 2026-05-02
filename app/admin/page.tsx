export default function AdminDashboard() {
    return (
        <div>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="heading-1">Panel de Control</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bienvenido, Administrador. Gestiona tu plataforma desde aquí.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ventas Totales</p>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>$12,450</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>+12% este mes</span>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nuevas Reservas</p>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>48</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>+5 hoy</span>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Yates Activos</p>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>12</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>6 en puerto</span>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Taxis Disponibles</p>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>24</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>-2 ocupados</span>
                </div>
            </div>

            <section style={{ marginTop: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Reservas Recientes</h2>
                    <button className="btn-premium" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Ver todas</button>
                </div>
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.5rem' }}>Cliente</th>
                                <th style={{ padding: '1.5rem' }}>Estado</th>
                                <th style={{ padding: '1.5rem' }}>Servicios</th>
                                <th style={{ padding: '1.5rem' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                    <td style={{ padding: '1.5rem' }}>Cliente Premium {i}</td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.8rem' }}>Completado</span>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>Yate, Hotel, Taxi</td>
                                    <td style={{ padding: '1.5rem', fontWeight: 600 }}>$850.00</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
