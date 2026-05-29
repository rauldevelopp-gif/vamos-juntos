'use client';

import { useState } from 'react';
import { Key, Save, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('La nueva contraseña y la confirmación no coinciden');
            return;
        }

        if (newPassword.length < 8) {
            setError('La nueva contraseña debe tener al menos 8 caracteres');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401 && data.error === 'No autorizado') {
                    router.push('/login');
                    return;
                }
                throw new Error(data.error || 'Error al actualizar la contraseña');
            }

            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: 'calc(100vh - 200px)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
                    <ArrowLeft size={18} />
                    Volver al Inicio
                </Link>
            </div>

            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Key size={24} color="var(--primary)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>Gestión de Contraseña</h1>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Actualiza tu contraseña de acceso</p>
                    </div>
                </div>

                {success && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                        <CheckCircle2 size={20} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>¡Contraseña actualizada exitosamente!</span>
                    </div>
                )}

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                        <ShieldAlert size={20} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Contraseña Actual</label>
                        <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="glass-card" 
                            placeholder="Ingresa tu contraseña actual"
                            style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}
                        />
                    </div>
                    
                    <div style={{ height: '1px', background: 'var(--border-glass)', margin: '0.5rem 0' }} />

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nueva Contraseña</label>
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="glass-card" 
                            placeholder="Mínimo 8 caracteres"
                            style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confirmar Nueva Contraseña</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="glass-card" 
                            placeholder="Repite la nueva contraseña"
                            style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-premium" 
                        disabled={loading}
                        style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem', marginTop: '1rem' }}
                    >
                        {loading ? (
                            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>↻</span>
                        ) : (
                            <Save size={18} />
                        )}
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
}
