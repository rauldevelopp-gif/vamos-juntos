'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { User, Mail, MapPin, Phone, Globe, UserCircle2, ArrowLeft, Loader2, CheckCircle2, Sparkles, Car, Briefcase, ShieldCheck, RotateCcw, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

const OTP_EXPIRY_SECONDS = 4 * 60; // 4 minutes

export default function RegisterPage() {
    const { t } = useLanguage();

    // Form data
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        country: '',
        phone: '',
        email: '',
        userType: 'operator'
    });

    // Flow state: 'form' | 'otp' | 'success'
    const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tempPassword, setTempPassword] = useState('');

    // OTP state
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Start/restart countdown
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

    // Submit the registration form → send OTP
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/register/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send', email: formData.email, userData: formData }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar código');
            setStep('otp');
            startTimer();
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    // Handle each OTP digit input
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
            inputRefs.current[5]?.focus();
        }
        e.preventDefault();
    };

    // Verify OTP
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpDigits.join('');
        if (code.length < 6) { setError('Ingresa los 6 dígitos'); return; }
        if (secondsLeft === 0) { setError('El código expiró. Solicita uno nuevo.'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/register/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify', email: formData.email, code }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Código incorrecto');
            clearInterval(timerRef.current!);
            setTempPassword(data.tempPassword || '');
            setStep('success');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setOtpDigits(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResend = async () => {
        setResending(true);
        setError('');
        setOtpDigits(['', '', '', '', '', '']);
        try {
            const res = await fetch('/api/register/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send', email: formData.email }),
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

    // ── Styles ──────────────────────────────────────
    const sharedStyles = `
        .register-panel { padding: 3.5rem; width: 100%; max-width: 650px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .user-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .user-type-card { position: relative; cursor: pointer; border: 2px solid var(--border-glass); border-radius: 1rem; padding: 1.25rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.03); transition: all 0.25s ease; text-align: center; user-select: none; }
        .user-type-card:hover { border-color: rgba(139,92,246,0.5); background: rgba(139,92,246,0.06); }
        .user-type-card.selected { border-color: var(--primary); background: rgba(139,92,246,0.12); box-shadow: 0 0 0 1px var(--primary), 0 4px 20px rgba(139,92,246,0.2); }
        .user-type-card .card-label { font-size: 1rem; font-weight: 700; color: white; }
        .user-type-card .card-desc { font-size: 0.75rem; color: var(--text-muted); }
        .user-type-card .check-dot { position: absolute; top: 0.6rem; right: 0.6rem; width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border-glass); transition: all 0.2s; background: transparent; }
        .user-type-card.selected .check-dot { background: var(--primary); border-color: var(--primary); }
        .otp-input { width: 52px; height: 64px; text-align: center; font-size: 1.6rem; font-weight: 800; background: rgba(255,255,255,0.05); border: 2px solid var(--border-glass); border-radius: 12px; color: white; transition: all 0.2s; caret-color: var(--primary); }
        .otp-input:focus { border-color: var(--primary); background: rgba(139,92,246,0.08); outline: none; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
        .otp-input.filled { border-color: rgba(139,92,246,0.5); }
        .timer-bar { height: 4px; border-radius: 9999px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .timer-fill { height: 100%; border-radius: 9999px; background: linear-gradient(90deg, var(--primary), #0ea5e9); transition: width 1s linear; }
        .timer-fill.critical { background: linear-gradient(90deg, #f43f5e, #ef4444); }
        .error-box { display: flex; align-items: center; gap: 0.5rem; background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); color: #f43f5e; font-size: 0.85rem; padding: 0.8rem 1rem; border-radius: 10px; }
        @media (max-width: 768px) {
            .register-panel { padding: 2rem 1.5rem !important; margin: 1rem; background: var(--bg-card) !important; border: 1px solid var(--border-glass) !important; box-shadow: var(--shadow-lg) !important; }
            .form-grid, .user-type-grid { grid-template-columns: 1fr !important; }
            .reg-header h1 { font-size: 1.8rem !important; }
            .otp-input { width: 44px; height: 56px; font-size: 1.4rem; }
        }
        @media (max-width: 380px) {
            .otp-input { width: 38px; height: 50px; font-size: 1.2rem; border-radius: 8px; }
        }
    `;

    // ── SUCCESS SCREEN ────────────────────────────
    if (step === 'success') {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
                <style jsx>{sharedStyles}</style>
                <div className="glass-panel register-panel" style={{ textAlign: 'center' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #0ea5e9)', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(139,92,246,0.4)', animation: 'float 3s ease-in-out infinite' }}>
                        <CheckCircle2 size={46} color="white" />
                    </div>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>¡Verificación Exitosa!</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                        Bienvenido a <strong style={{ color: 'white' }}>VamosJuntos</strong>.
                    </p>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Tu cuenta de <strong style={{ color: 'var(--primary)' }}>{formData.userType === 'operator' ? 'Operador' : 'Transportista'}</strong> ha sido registrada exitosamente.
                    </p>
                    
                    {tempPassword && (
                        <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px dashed rgba(139,92,246,0.4)', borderRadius: '10px', padding: '1rem', marginBottom: '2rem', display: 'inline-block', textAlign: 'left' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Tu contraseña temporal de acceso es:</p>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white', letterSpacing: '2px', fontFamily: 'monospace' }}>{tempPassword}</div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--primary)', margin: '0.5rem 0 0 0' }}>Por favor guárdala en un lugar seguro.</p>
                        </div>
                    )}

                    <Link href="/login" className="btn-premium" style={{ padding: '1rem 2.5rem', display: 'inline-flex', gap: '0.6rem', alignItems: 'center' }}>
                        <ArrowLeft size={18} />
                        Ir al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    // ── OTP SCREEN ────────────────────────────────
    if (step === 'otp') {
        const timerPct = (secondsLeft / OTP_EXPIRY_SECONDS) * 100;
        const isCritical = secondsLeft <= 60;
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
                <style jsx>{sharedStyles}</style>
                <div className="glass-panel register-panel" style={{ maxWidth: '480px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'var(--primary)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(139,92,246,0.3)' }}>
                            <ShieldCheck size={35} color="white" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Verifica tu correo
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            Enviamos un código de 6 dígitos a<br />
                            <strong style={{ color: 'white' }}>{formData.email}</strong>
                        </p>
                    </div>

                    {/* Timer bar */}
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

                    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* OTP inputs */}
                        <div onPaste={handleOtpPaste} style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'nowrap' }}>
                            {otpDigits.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => { inputRefs.current[idx] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                                    className={`otp-input${digit ? ' filled' : ''}`}
                                    disabled={secondsLeft === 0 || loading}
                                />
                            ))}
                        </div>

                        {error && <div className="error-box">{error}</div>}

                        {secondsLeft === 0 ? (
                            <div style={{ textAlign: 'center', color: '#f43f5e', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(244,63,94,0.08)', borderRadius: '10px' }}>
                                ⏱ El código ha expirado.
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="btn-premium"
                                disabled={loading || otpDigits.join('').length < 6}
                                style={{ height: '58px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem' }}
                            >
                                {loading ? <Loader2 className="animate-spin" size={22} /> : <><ShieldCheck size={20} /> Verificar Código</>}
                            </button>
                        )}

                        {/* Resend */}
                        <div style={{ textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending || (secondsLeft > 0 && secondsLeft < OTP_EXPIRY_SECONDS - 30)}
                                style={{ background: 'none', border: 'none', color: resending ? 'var(--text-muted)' : 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', opacity: (secondsLeft > 0 && secondsLeft < OTP_EXPIRY_SECONDS - 30) ? 0.4 : 1 }}
                            >
                                {resending ? <Loader2 className="animate-spin" size={15} /> : <RotateCcw size={15} />}
                                Reenviar código
                            </button>
                            {(secondsLeft > 0 && secondsLeft < OTP_EXPIRY_SECONDS - 30) && (
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                    Disponible si el código expira
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => { setStep('form'); setOtpDigits(['','','','','','']); setError(''); }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                        >
                            <ArrowLeft size={14} /> Volver al formulario
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── FORM SCREEN ────────────────────────────────
    return (
        <div className="container" style={{ minHeight: '100vh', padding: '2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <style jsx>{sharedStyles}</style>

            <div className="glass-panel register-panel">
                <div className="reg-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'var(--primary)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(139,92,246,0.3)' }}>
                        <Sparkles size={35} color="white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                        {t('reg_title')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        {t('reg_subtitle')}
                    </p>
                </div>

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    <div className="form-grid">
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <User size={16} /> {t('full_name')}
                            </label>
                            <input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="glass-card" style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }} placeholder="John Doe" required />
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <Mail size={16} /> {t('email')}
                            </label>
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="glass-card" style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }} placeholder="john@example.com" required />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <MapPin size={16} /> {t('address')}
                        </label>
                        <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="glass-card" style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }} placeholder="Street address, Apt/Suite" required />
                    </div>

                    <div className="form-grid">
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <Globe size={16} /> {t('country')}
                            </label>
                            <input type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="glass-card" style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }} placeholder="Mexico" required />
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <Phone size={16} /> {t('phone')}
                            </label>
                            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="glass-card" style={{ width: '100%', padding: '1rem', color: 'white', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }} placeholder="+1 (555) 000-0000" required />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <UserCircle2 size={16} /> {t('user_type')}
                        </label>
                        <div className="user-type-grid">
                            {[
                                { value: 'operator', icon: <Briefcase size={28} color={formData.userType === 'operator' ? 'var(--primary)' : 'rgba(255,255,255,0.4)'} />, label: t('operator'), desc: 'Gestión y operación de servicios' },
                                { value: 'transporter', icon: <Car size={28} color={formData.userType === 'transporter' ? 'var(--primary)' : 'rgba(255,255,255,0.4)'} />, label: t('transporter'), desc: 'Transporte y traslados' },
                            ].map(opt => (
                                <div key={opt.value} className={`user-type-card${formData.userType === opt.value ? ' selected' : ''}`} onClick={() => setFormData({ ...formData, userType: opt.value })}>
                                    <div className="check-dot" />
                                    {opt.icon}
                                    <span className="card-label">{opt.label}</span>
                                    <span className="card-desc">{opt.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && <div className="error-box">{error}</div>}

                    <button type="submit" className="btn-premium" disabled={loading} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', height: '60px', fontSize: '1.1rem' }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>{t('btn_submit_reg')} <ShieldCheck size={20} /></>}
                    </button>

                    <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s' }} className="hover-opacity">
                        <ArrowLeft size={16} />
                        <span>{t('back_to_site')}</span>
                    </Link>
                </form>
            </div>
        </div>
    );
}
