'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { getActiveUserWarnings, markWarningAsReadAction } from '@/app/admin/users/actions';

export default function WarningBanner() {
    const [warnings, setWarnings] = useState<any[]>([]);
    const [activeWarning, setActiveWarning] = useState<any | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Fetch active warnings for the currently logged in user
        getActiveUserWarnings()
            .then(res => {
                if (res.success && res.data && res.data.length > 0) {
                    setWarnings(res.data);
                    setActiveWarning(res.data[0]); // Show the first unread warning
                }
            })
            .catch(err => console.error("Error loading user warning alerts:", err));
    }, []);

    const handleConfirm = async () => {
        if (!activeWarning || submitting) return;
        setSubmitting(true);
        
        try {
            const res = await markWarningAsReadAction(activeWarning.id);
            if (res.success) {
                // Remove warning from active list
                const remaining = warnings.filter(w => w.id !== activeWarning.id);
                setWarnings(remaining);
                
                if (remaining.length > 0) {
                    setActiveWarning(remaining[0]); // Show next warning
                } else {
                    setActiveWarning(null);
                }
            }
        } catch (e) {
            console.error("Error confirming warning:", e);
        } finally {
            setSubmitting(false);
        }
    };

    if (!activeWarning) return null;

    const getSeverityStyles = (sev: string) => {
        switch(sev) {
            case 'INFO': return {
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                glow: '0 0 25px rgba(59, 130, 246, 0.2)',
                bg: 'rgba(5, 7, 10, 0.95)',
                icon: <Info size={28} color="#3b82f6" />
            };
            case 'WARN': return {
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                glow: '0 0 25px rgba(245, 158, 11, 0.2)',
                bg: 'rgba(5, 7, 10, 0.95)',
                icon: <AlertTriangle size={28} color="#f59e0b" />
            };
            case 'RISK': return {
                color: '#f97316',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                glow: '0 0 25px rgba(249, 115, 22, 0.2)',
                bg: 'rgba(5, 7, 10, 0.95)',
                icon: <AlertCircle size={28} color="#f97316" />
            };
            case 'CRITICAL': return {
                color: 'var(--accent)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                glow: '0 0 35px rgba(244, 63, 94, 0.3)',
                bg: 'rgba(10, 2, 5, 0.97)',
                icon: <ShieldAlert size={32} color="var(--accent)" className="float-animation" />
            };
            default: return {
                color: 'white',
                border: '1px solid var(--border-glass)',
                glow: '0 0 15px rgba(255, 255, 255, 0.05)',
                bg: 'rgba(5, 7, 10, 0.95)',
                icon: <Info size={28} color="white" />
            };
        }
    };

    const style = getSeverityStyles(activeWarning.severity);
    const isConfirmRequired = activeWarning.behavior === 'CONFIRM' || activeWarning.behavior === 'PERSISTENT';

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            webkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999, // Exceed all components, sidebars, toggle buttons
            padding: '1.5rem'
        }}>
            <div 
                className="glass-panel" 
                style={{ 
                    padding: '2.5rem', 
                    maxWidth: '520px', 
                    width: '100%', 
                    background: style.bg,
                    borderColor: style.color,
                    boxShadow: style.glow,
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '1.5rem',
                    animation: activeWarning.severity === 'CRITICAL' ? 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate-reverse' : 'scaleUp 0.3s ease-out',
                    animationDuration: activeWarning.severity === 'CRITICAL' ? '1.5s' : '0.3s'
                }}
            >
                {/* Severity Icon */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: `${style.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${style.color}33`,
                    marginBottom: '0.5rem'
                }}>
                    {style.icon}
                </div>

                {/* Content */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {activeWarning.title}
                    </h2>
                    <div style={{
                        padding: '0.15rem 0.6rem',
                        borderRadius: '4px',
                        background: `${style.color}18`,
                        color: style.color,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        display: 'inline-block',
                        marginTop: '0.4rem',
                        textTransform: 'uppercase'
                    }}>
                        Notificación Disciplinaria Oficial
                    </div>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '1.25rem', marginBottom: 0 }}>
                        {activeWarning.message}
                    </p>
                </div>

                {/* Confirmation Action */}
                <div style={{ width: '100%', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                    {isConfirmRequired ? (
                        <button 
                            disabled={submitting}
                            onClick={handleConfirm}
                            className="btn-premium" 
                            style={{ 
                                width: '100%', 
                                justifyContent: 'center', 
                                background: `linear-gradient(135deg, ${style.color}, rgba(0,0,0,0))`,
                                backgroundColor: style.color,
                                boxShadow: `0 4px 15px ${style.color}33`,
                                color: 'white',
                                padding: '0.75rem 2rem',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                            }}
                        >
                            {submitting ? 'Registrando Confirmación...' : 'Entendido y Confirmar Lectura'}
                        </button>
                    ) : (
                        <button 
                            onClick={handleConfirm}
                            className="btn-glass-nav" 
                            style={{ width: '100%', justifyContent: 'center', borderRadius: '12px', fontSize: '0.85rem', padding: '0.75rem' }}
                        >
                            Cerrar Notificación
                        </button>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0.9; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}} />
        </div>
    );
}
