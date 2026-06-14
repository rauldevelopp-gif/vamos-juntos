'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isDestructive = true
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000, padding: '2rem'
        }}>
            <div className="glass-panel" onClick={e => e.stopPropagation()} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                borderRadius: '24px', width: '100%', maxWidth: '400px',
                padding: '2rem', textAlign: 'center', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isDestructive ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: isDestructive ? '#f43f5e' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <AlertTriangle size={32} />
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                    {message}
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={onCancel} className="btn-secondary" style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className="btn-premium" style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', background: isDestructive ? '#f43f5e' : 'var(--primary)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                        {confirmText}
                    </button>
                </div>
            </div>
            <style jsx>{`
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
