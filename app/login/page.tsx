'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
            setError('Algo salió mal. Por favor intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>
                    Confort Travel
                </h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    Panel de Administración
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="glass-card"
                            style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)' }}
                            placeholder="Admin"
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glass-card"
                            style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)' }}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p style={{ color: 'var(--accent)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-premium" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Iniciando sesión...' : 'Entrar al Panel'}
                    </button>
                </form>
            </div>
        </div>
    );
}
