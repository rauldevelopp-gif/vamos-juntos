'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldAlert, KeyRound, Clock } from 'lucide-react';
import Link from 'next/link';

const OTP_EXPIRY_SECONDS = 4 * 60; // 4 minutes

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<'email' | 'verify' | 'success'>('email');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // OTP state
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setSecondsLeft(OTP_EXPIRY_SECONDS);
        timerRef.current = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    // Step 1: Request OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Ingresa tu correo electrónico');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send', email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar código');
            setStep('verify');
            startTimer();
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    // OTP Inputs handlers
    const handleOtpChange = (idx: number, val: string) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otpDigits];
        next[idx] = val;
        setOtpDigits(next);
        if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    };

    const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtpDigits(pasted.split(''));
            // Focus on password field instead of the 6th digit if possible
        }
        e.preventDefault();
    };

    // Resend OTP
    const handleResend = async () => {
        setResending(true);
        setError('');
        setOtpDigits(['', '', '', '', '', '']);
        try {
            const res = await fetch('/api/auth/recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send', email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al reenviar');
            startTimer();
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al reenviar');
        } finally {
            setResending(false);
        }
    };

    // Step 2: Verify OTP and Change Password
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpDigits.join('');
        if (code.length < 6) { setError('Ingresa los 6 dígitos completos del código'); return; }
        if (secondsLeft === 0) { setError('El código expiró. Solicita uno nuevo.'); return; }
        if (!newPassword || !confirmPassword) { setError('Completa los campos de contraseña'); return; }
        if (newPassword !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }
        if (newPassword.length < 8) { setError('La nueva contraseña debe tener al menos 8 caracteres'); return; }
        
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify', email, code, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Código incorrecto o error al verificar');
            clearInterval(timerRef.current!);
            setStep('success');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const sharedStyles = `
        .recover-panel { padding: 3rem; width: 100%; max-width: 550px; text-align: center; }
        .otp-input { width: 48px; height: 60px; text-align: center; font-size: 1.5rem; font-weight: 800; background: rgba(255,255,255,0.05); border: 2px solid var(--border-glass); border-radius: 12px; color: white; transition: all 0.2s; caret-color: var(--primary); }
        .otp-input:focus { border-color: var(--primary); background: rgba(139,92,246,0.08); outline: none; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
        .otp-input.filled { border-color: rgba(139,92,246,0.5); }
        .timer-bar { height: 4px; border-radius: 9999px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .timer-fill { height: 100%; border-radius: 9999px; background: linear-gradient(90deg, var(--primary), #0ea5e9); transition: width 1s linear; }
        .timer-fill.critical { background: linear-gradient(90deg, #f43f5e, #ef4444); }
        @media (max-width: 768px) {
            .recover-panel { padding: 2rem 1.5rem !important; margin: 1rem; }
            .otp-input { width: 40px; height: 50px; font-size: 1.2rem; }
        }
    `;

    if (step === 'success') {
        return (
            <div className="container" style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
                <style jsx>{sharedStyles}</style>
                <div className="glass-panel recover-panel">
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(16,185,129,0.3)' }}>
                        <CheckCircle2 size={40} color="white" />
                    </div>
                    <h1 className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>¡Contraseña Actualizada!</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1rem' }}>
                        Tu contraseña se ha restablecido correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                    </p>
                    <Link href="/login" className="btn-premium" style={{ padding: '1rem 2.5rem', display: 'inline-flex', gap: '0.6rem', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                        Ir a Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 'verify') {
        const timerPct = (secondsLeft / OTP_EXPIRY_SECONDS) * 100;
        const isCritical = secondsLeft <= 60;
        return (
            <div className="container" style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
                <style jsx>{sharedStyles}</style>
                <div className="glass-panel recover-panel">
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--primary)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(139,92,246,0.3)' }}>
                        <KeyRound size={30} color="white" />
                    </div>
                    <h1 className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Verifica tu Identidad</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        Enviamos un código a <strong style={{ color: 'white' }}>{email}</strong>
                    </p>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', fontSize: '0.85rem', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1rem', textAlign: 'left' }}>
                            <ShieldAlert size={16} /> {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Clock size={13} /> El código expira en
                            </span>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: isCritical ? '#f43f5e' : 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                                {formatTime(secondsLeft)}
                            </span>
                        </div>
                        <div className="timer-bar">
                            <div className={`timer-fill ${isCritical ? 'critical' : ''}`} style={{ width: `${timerPct}%` }} />
                        </div>
                    </div>

                    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>Ingresa el Código de 6 Dígitos</label>
                            <div onPaste={handleOtpPaste} style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'nowrap' }}>
                                {otpDigits.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={el => { inputRefs.current[idx] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                                        className={`otp-input ${digit ? 'filled' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <div style={{ height: '1px', background: 'var(--border-glass)', margin: '0.5rem 0' }} />

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nueva Contraseña</label>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confirmar Nueva Contraseña</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="glass-card" 
                                placeholder="Repite la nueva contraseña"
                                style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}
                            />
                        </div>

                        <button type="submit" className="btn-premium" disabled={loading} style={{ padding: '1rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            {loading && <Loader2 size={18} className="spin" />}
                            Restablecer Contraseña
                        </button>
                    </form>
                    
                    <div style={{ marginTop: '1.5rem' }}>
                        {secondsLeft === 0 ? (
                            <button onClick={handleResend} disabled={resending} className="btn-glass" style={{ width: '100%' }}>
                                {resending ? 'Reenviando...' : 'Reenviar Código'}
                            </button>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                ¿No recibiste el código? Podrás reenviarlo cuando expire el tiempo.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <style jsx>{sharedStyles}</style>
            
            <div style={{ width: '100%', maxWidth: '450px', marginBottom: '2rem' }}>
                <Link href="/login" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
                    <ArrowLeft size={18} />
                    Volver al Login
                </Link>
            </div>

            <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mail size={28} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'white' }}>Recuperar Contraseña</h1>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Ingresa el correo electrónico asociado a tu cuenta para recibir un código de recuperación.
                    </p>
                </div>

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                        <ShieldAlert size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Correo Electrónico</label>
                        <div className="input-group">
                            <span className="input-icon"><Mail size={18} /></span>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="glass-card" 
                                placeholder="tu@correo.com"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-premium" 
                        disabled={loading}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                    >
                        {loading && <Loader2 size={18} className="spin" />}
                        Enviar Código
                    </button>
                </form>
            </div>
        </div>
    );
}
