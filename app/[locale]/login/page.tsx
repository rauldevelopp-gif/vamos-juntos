'use client';

import { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useRouter } from '../../../navigation';
import { useLanguage } from '../../../context/LanguageContext';

export default function LoginPage() {
    const { language, t } = useLanguage();
    const isEn = language === 'en';

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
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.role === 'USER') {
                    router.push('/tracking');
                } else {
                    router.push('/admin');
                }
            } else {
                setError(isEn ? 'Invalid credentials. Please try again.' : 'Credenciales inválidas. Intenta de nuevo.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(isEn ? 'Something went wrong. Please try again later.' : 'Algo salió mal. Por favor intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }} className="hover-opacity">
                <ArrowLeft size={18} />
                <span>{t('back_to_site') || (isEn ? "Back to site" : "Volver al sitio")}</span>
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
                        {isEn ? "Administration Panel" : "Panel de Administración"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <User size={14} /> {isEn ? "Username" : "Usuario"}
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
                            <KeyRound size={14} /> {isEn ? "Password" : "Contraseña"}
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
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isEn ? 'Enter Panel' : 'Entrar al Panel')}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <Link href="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
                            {isEn ? "Forgot your password? " : "¿Olvidaste tu contraseña? "}<span style={{ color: 'var(--primary)', fontWeight: 600 }}>{isEn ? "Recover it here" : "Recupérala aquí"}</span>
                        </Link>
                        <Link href="/register" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
                            {isEn ? "Don't have an account? " : "¿No tienes cuenta? "}<span style={{ color: 'var(--primary)', fontWeight: 600 }}>{isEn ? "Register here" : "Regístrate aquí"}</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
