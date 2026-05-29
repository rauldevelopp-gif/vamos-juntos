'use client';

import { useState, useEffect } from 'react';
import { getGatewaySettings, saveGatewaySettings } from './actions';
import { CreditCard, Save, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    
    const [formData, setFormData] = useState({
        stripePublicKey: '',
        stripeSecretKey: '',
        paypalClientId: '',
        paypalSecret: '',
        activeGateways: [] as string[]
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        const res = await getGatewaySettings();
        if (res.success && res.data) {
            setFormData({
                stripePublicKey: res.data.stripePublicKey || '',
                stripeSecretKey: res.data.stripeSecretKey || '',
                paypalClientId: res.data.paypalClientId || '',
                paypalSecret: res.data.paypalSecret || '',
                activeGateways: res.data.activeGateways || []
            });
        }
        setLoading(false);
    };

    const handleToggleGateway = (gateway: string) => {
        setFormData(prev => {
            const actives = prev.activeGateways.includes(gateway)
                ? prev.activeGateways.filter(g => g !== gateway)
                : [...prev.activeGateways, gateway];
            return { ...prev, activeGateways: actives };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ text: '', type: '' });
        
        const res = await saveGatewaySettings(formData);
        
        if (res.success) {
            setMessage({ text: 'Configuración guardada exitosamente.', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
            setMessage({ text: res.error || 'Error al guardar.', type: 'error' });
        }
        setSaving(false);
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>Cargando configuración...</div>;
    }

    return (
        <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <CreditCard size={28} color="#8b5cf6" /> Configuración de Facturación
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Vincula tus pasarelas de pago para recibir el dinero de las reservas directamente en tus cuentas.
                </p>
            </div>

            {message.text && (
                <div style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    marginBottom: '2rem', 
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.type === 'success' ? '#10b981' : '#ef4444',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 700
                }}>
                    <AlertCircle size={18} /> {message.text}
                </div>
            )}

            {/* STRIPE */}
            <div className="gateway-card">
                <div className="gateway-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="gateway-icon" style={{ background: '#635BFF' }}>S</div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'white' }}>Stripe</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Acepta tarjetas de crédito y débito globalmente.</p>
                        </div>
                    </div>
                    <label className="toggle-switch">
                        <input 
                            type="checkbox" 
                            checked={formData.activeGateways.includes('stripe')}
                            onChange={() => handleToggleGateway('stripe')}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                
                {formData.activeGateways.includes('stripe') && (
                    <div className="gateway-body">
                        <div className="input-group">
                            <label>Clave Pública (Public Key)</label>
                            <input 
                                type="text" 
                                placeholder="pk_live_..." 
                                value={formData.stripePublicKey}
                                onChange={e => setFormData({...formData, stripePublicKey: e.target.value})}
                            />
                        </div>
                        <div className="input-group">
                            <label><Lock size={12} /> Clave Secreta (Secret Key)</label>
                            <input 
                                type="password" 
                                placeholder="sk_live_..." 
                                value={formData.stripeSecretKey}
                                onChange={e => setFormData({...formData, stripeSecretKey: e.target.value})}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* PAYPAL */}
            <div className="gateway-card">
                <div className="gateway-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="gateway-icon" style={{ background: '#003087', color: '#0079C1' }}>P</div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'white' }}>PayPal</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Permite pagos con cuenta PayPal o tarjeta.</p>
                        </div>
                    </div>
                    <label className="toggle-switch">
                        <input 
                            type="checkbox" 
                            checked={formData.activeGateways.includes('paypal')}
                            onChange={() => handleToggleGateway('paypal')}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                
                {formData.activeGateways.includes('paypal') && (
                    <div className="gateway-body">
                        <div className="input-group">
                            <label>Client ID</label>
                            <input 
                                type="text" 
                                placeholder="Pega tu Client ID aquí..." 
                                value={formData.paypalClientId}
                                onChange={e => setFormData({...formData, paypalClientId: e.target.value})}
                            />
                        </div>
                        <div className="input-group">
                            <label><Lock size={12} /> Secret Key</label>
                            <input 
                                type="password" 
                                placeholder="Pega tu Secret Key aquí..." 
                                value={formData.paypalSecret}
                                onChange={e => setFormData({...formData, paypalSecret: e.target.value})}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                    <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Configuración'}
                </button>
            </div>

            <style jsx>{`
                .gateway-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border-glass);
                    border-radius: 20px;
                    margin-bottom: 2rem;
                    overflow: hidden;
                }
                .gateway-header {
                    padding: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .gateway-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: white;
                }
                .gateway-body {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    background: rgba(0, 0, 0, 0.2);
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .input-group label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .input-group input {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-glass);
                    padding: 1rem;
                    border-radius: 12px;
                    color: white;
                    font-size: 0.95rem;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-group input:focus {
                    border-color: #8b5cf6;
                    background: rgba(139, 92, 246, 0.05);
                }
                
                /* Toggle Switch */
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 26px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(255, 255, 255, 0.1);
                    transition: .4s;
                    border-radius: 34px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: #10b981;
                }
                input:checked + .slider:before {
                    transform: translateX(24px);
                }
                
                .btn-primary {
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-weight: 900;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
                }
                .btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
