'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, KeyRound, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // In a real app, this would be an API call to verify credentials
            // and set a secure HttpOnly cookie. For this demo, we'll simulate it.
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/admin');
            } else {
                setError('Credenciales inválidas. Intenta de nuevo.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Algo salió mal. Por favor intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }} className="hover-opacity">
                <ArrowLeft size={18} />
                <span>Volver al sitio</span>
            </Link>

            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'var(--primary)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)' }}>
                        <Lock size={30} color="white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        VamosJuntos
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Panel de Administración
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <User size={14} /> Usuario
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="glass-card"
                            style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}
                            placeholder="Admin"
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <KeyRound size={14} /> Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glass-card"
                            style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: 'var(--accent)', fontSize: '0.85rem', background: 'rgba(244, 63, 94, 0.1)', padding: '0.8rem', borderRadius: '10px' }}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="btn-premium" disabled={loading} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', height: '54px' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar al Panel'}
                    </button>
                </form>
            </div>
        </div>
    );
}
