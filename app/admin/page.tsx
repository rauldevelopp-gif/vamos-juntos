import { getCurrentUser } from '@/lib/auth';
import { getDashboardReservations, getDashboardStats } from './package/actions';
import Link from 'next/link';
import styles from './admin.module.css';

interface ReservationData {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    time: string;
    passengers: number;
    status: string;
    totalPrice: number;
    package?: {
        name: string;
    };
}

interface DashboardStats {
    totalSales: number;
    totalFees: number;
    totalReservations: number;
    yachtCount: number;
    taxiCount: number;
}

export default async function AdminDashboard() {
    const user = await getCurrentUser();
    const displayName = user?.name || user?.username || 'Administrador';

    const [resResult, statsResult] = await Promise.all([
        getDashboardReservations(),
        getDashboardStats()
    ]);

    const reservations: ReservationData[] = resResult.success && resResult.data ? (resResult.data as unknown as ReservationData[]) : [];
    const stats: DashboardStats = statsResult.success && statsResult.data 
        ? (statsResult.data as unknown as DashboardStats) 
        : {
            totalSales: 0,
            totalFees: 0,
            totalReservations: 0,
            yachtCount: 0,
            taxiCount: 0
        };

    const getDaysDifference = (dateString: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Assuming date is YYYY-MM-DD
        const targetDate = new Date(dateString + 'T00:00:00');
        
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getCountdownLabel = (dateString: string) => {
        const days = getDaysDifference(dateString);
        if (days < 0) return { text: 'Ya pasó', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
        if (days === 0) return { text: 'Es Hoy', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
        if (days === 1) return { text: 'Mañana', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
        return { text: `Faltan ${days} días`, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' };
    };

    return (
        <div>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="heading-1">Panel de Control</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bienvenido, {displayName}. Gestiona tu plataforma desde aquí.</p>
            </header>

            <div className={styles.dashboardStatsGrid}>
                <div className={styles.glassCard}>
                    <p className={styles.statLabel}>Ventas Totales</p>
                    <div className={styles.statValue}>${stats.totalSales.toLocaleString()}</div>
                    <span className={styles.statSub} style={{ color: 'var(--secondary)' }}>Bruto acumulado</span>
                </div>
                <div className={styles.glassCard}>
                    <p className={styles.statLabel}>Cargos Operativos (5%)</p>
                    <div className={styles.statValue} style={{ color: '#10b981' }}>${stats.totalFees.toLocaleString()}</div>
                    <span className={styles.statSub} style={{ color: 'var(--text-muted)' }}>Comisiones totales</span>
                </div>
                <div className={styles.glassCard}>
                    <p className={styles.statLabel}>Reservas</p>
                    <div className={styles.statValue}>{stats.totalReservations}</div>
                    <span className={styles.statSub} style={{ color: 'var(--secondary)' }}>Gestiones totales</span>
                </div>
                <div className={styles.glassCard}>
                    <p className={styles.statLabel}>Flota de Yates</p>
                    <div className={styles.statValue}>{stats.yachtCount}</div>
                    <span className={styles.statSub} style={{ color: 'var(--text-muted)' }}>Unidades activas</span>
                </div>
                <div className={styles.glassCard}>
                    <p className={styles.statLabel}>Taxis / Chóferes</p>
                    <div className={styles.statValue}>{stats.taxiCount}</div>
                    <span className={styles.statSub} style={{ color: 'var(--accent)' }}>Equipo operativo</span>
                </div>
            </div>

            <section style={{ marginTop: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Próximas Reservas</h2>
                    <Link href="/admin/reservations" className="btn-premium" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                        <span className="btn-text-mobile-hide">Ver todas</span>
                        <span style={{ marginLeft: '0.5rem' }}>📑</span>
                    </Link>
                </div>
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1.5rem' }}>Cliente</th>
                                <th style={{ padding: '1.5rem' }}>Tour</th>
                                <th style={{ padding: '1.5rem' }}>Fecha</th>
                                <th style={{ padding: '1.5rem' }}>Estado</th>
                                <th style={{ padding: '1.5rem' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No tienes reservas recientes.</td>
                                </tr>
                            ) : (
                                reservations.map((res: ReservationData) => {
                                    const countdown = getCountdownLabel(res.date);
                                    return (
                                        <tr key={res.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ fontWeight: 600 }}>{res.customerName}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.customerEmail}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res.customerPhone}</div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ fontWeight: 600 }}>{res.package?.name || 'Paquete Eliminado'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.passengers} pax</div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ fontWeight: 600 }}>{res.date} a las {res.time}</div>
                                                <div style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', marginTop: '0.2rem', color: countdown.color, background: countdown.bg, fontWeight: 700 }}>
                                                    {countdown.text}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <span style={{ padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.75rem', fontWeight: 800 }}>{res.status}</span>
                                            </td>
                                            <td style={{ padding: '1.5rem', fontWeight: 600 }}>${res.totalPrice.toLocaleString()} USD</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
