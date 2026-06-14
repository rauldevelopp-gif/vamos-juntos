'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, CreditCard, ChevronRight, ArrowLeft, CheckCircle2, Loader2, Tag, X } from 'lucide-react';
import { createHotelReservation } from '../actions';
import { validateDiscountCodeForHotel } from '../../admin/discounts/actions';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCurrency } from '../../../../context/CurrencyContext';

// --- Stripe Form ---
const CheckoutForm = ({ clientSecret, onPaymentSuccess, amount }: any) => {
    const { formatPrice } = useCurrency();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        const cardElement = elements.getElement(CardElement);
        
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement! }
        });

        if (error) {
            setError(error.message || 'Error en el pago');
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onPaymentSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stripe-form">
            <div className="card-input-container">
                <CardElement options={{
                    style: {
                        base: { fontSize: '16px', color: '#ffffff', '::placeholder': { color: '#aab7c4' }, iconColor: '#8b5cf6' },
                        invalid: { color: '#ef4444', iconColor: '#ef4444' },
                    }
                }} />
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</div>}
            <button type="submit" disabled={!stripe || processing} className="btn-premium" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '12px' }}>
                {processing ? 'Procesando...' : `Pagar ${formatPrice(amount)}`}
            </button>
            <style jsx>{`
                .card-input-container { padding: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
            `}</style>
        </form>
    );
};

// --- Wizard ---
export function HotelBookingWizard({ hotel, room, onCancel }: { hotel: any, room: any, onCancel: () => void }) {
    const { formatPrice } = useCurrency();
    const [step, setStep] = useState(1);
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [guests, setGuests] = useState(2);
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });

    // Discount state
    const [discountCode, setDiscountCode] = useState('');
    const [discountInfo, setDiscountInfo] = useState<{ code: string; percentage: number } | null>(null);
    const [discountError, setDiscountError] = useState('');
    const [validatingDiscount, setValidatingDiscount] = useState(false);

    // Payment Setup
    const [gateways, setGateways] = useState<any>(null);
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState('');
    const [activeTab, setActiveTab] = useState<'stripe' | 'paypal'>('stripe');
    const [processing, setProcessing] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);

    // Account claim state
    const [password, setPassword] = useState('');
    const [claiming, setClaiming] = useState(false);
    const [claimSuccess, setClaimSuccess] = useState(false);

    // Calc nights & price
    const nights = (dates.checkIn && dates.checkOut)
        ? Math.max(1, Math.ceil((new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
        : 1;

    const baseTotal = room.basePrice * nights;
    const discountAmount = discountInfo ? baseTotal * (discountInfo.percentage / 100) : 0;
    const finalPrice = baseTotal - discountAmount;

    const handleValidateDiscount = async () => {
        if (!discountCode) return;
        setValidatingDiscount(true);
        setDiscountError('');
        const res = await validateDiscountCodeForHotel(discountCode.toUpperCase(), hotel.id);
        if (res.success && res.data) {
            setDiscountInfo({ code: res.data.code, percentage: res.data.discount });
        } else {
            setDiscountError(res.error || 'Código inválido');
            setDiscountInfo(null);
        }
        setValidatingDiscount(false);
    };

    const removeDiscount = () => {
        setDiscountInfo(null);
        setDiscountCode('');
        setDiscountError('');
    };

    // Fetch gateways on mount
    useEffect(() => {
        fetch(`/api/checkout/config?userId=${hotel.userId}`)
            .then(r => r.json())
            .then(res => {
                if (res.success && res.data) {
                    setGateways(res.data);
                    if (res.data.stripePublicKey) {
                        setStripePromise(loadStripe(res.data.stripePublicKey));
                        if (res.data.activeGateways.includes('stripe')) setActiveTab('stripe');
                    } else if (res.data.activeGateways.includes('paypal')) {
                        setActiveTab('paypal');
                    }
                }
            });
    }, [hotel.userId]);

    // Prepare Stripe PaymentIntent on step 3
    useEffect(() => {
        if (step === 3 && gateways?.activeGateways.includes('stripe') && finalPrice > 0 && !clientSecret) {
            fetch('/api/checkout/stripe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalPrice,
                    currency: 'USD',
                    userId: hotel.userId,
                    description: `Reserva Hotel: ${hotel.name} - ${room.type}`
                })
            })
            .then(r => r.json())
            .then(res => {
                if (res.clientSecret) setClientSecret(res.clientSecret);
            });
        }
    }, [step, gateways, finalPrice, hotel, room, clientSecret]);

    const handleSuccess = async () => {
        setProcessing(true);
        const res = await createHotelReservation({
            hotelId: hotel.id,
            roomId: room.id,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            checkInDate: dates.checkIn,
            checkOutDate: dates.checkOut,
            guests,
            totalPrice: finalPrice,
            discountCode: discountInfo?.code,
            discountAmount: discountAmount > 0 ? discountAmount : undefined,
        });
        
        if (res.success) {
            setSuccessData(res.data);
            setStep(4);
        } else {
            alert('Error al guardar la reserva: ' + res.error);
        }
        setProcessing(false);
    };

    const handleClaimAccount = async () => {
        if (!password || password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        setClaiming(true);
        try {
            const res = await fetch('/api/auth/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: customer.email,
                    name: customer.name,
                    password,
                    locatorCode: successData?.locatorCode
                })
            });
            const data = await res.json();
            if (data.success) {
                setClaimSuccess(true);
            } else {
                alert(data.error || 'Error al crear la cuenta');
            }
        } catch (e) {
            alert('Error de conexión');
        }
        setClaiming(false);
    };

    // Step 4: Success screen
    if (step === 4) {
        return (
            <div className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.3)', background: 'linear-gradient(180deg, rgba(16,185,129,0.05) 0%, rgba(0,0,0,0) 100%)' }}>
                <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '1.8rem', margin: '0 0 1rem' }}>¡Reserva Confirmada!</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                    Tu habitación en <strong>{hotel.name}</strong> está lista. Hemos enviado el comprobante a {customer.email}.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', textAlign: 'left', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Localizador:</span>
                        <strong style={{ color: '#8b5cf6', fontSize: '1.2rem' }}>{successData?.locatorCode}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Check-in:</span>
                        <strong>{dates.checkIn} a las {hotel.checkInTime}</strong>
                    </div>
                    {discountInfo && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#10b981' }}>Descuento ({discountInfo.code}):</span>
                            <strong style={{ color: '#10b981' }}>-{formatPrice(discountAmount)}</strong>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Total Pagado:</span>
                        <strong>{formatPrice(finalPrice)}</strong>
                    </div>
                </div>

                {!claimSuccess ? (
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '1.5rem', borderRadius: '16px', textAlign: 'left', marginBottom: '2rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6', fontSize: '1.1rem' }}>¡Gestiona tu Reserva!</h4>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 1rem 0' }}>Crea una contraseña ahora para guardar tus datos y acceder a un panel privado con tu historial.</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="password" 
                                placeholder="Crea tu contraseña" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                            <button 
                                onClick={handleClaimAccount}
                                disabled={claiming}
                                style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: '#8b5cf6', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                            >
                                {claiming ? '...' : 'Crear Cuenta'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', marginBottom: '2rem' }}>
                        <p style={{ margin: 0, color: '#10b981', fontWeight: 800 }}>¡Cuenta creada exitosamente! Ya puedes iniciar sesión con tu correo.</p>
                    </div>
                )}

                <button onClick={onCancel} className="btn-premium" style={{ padding: '1rem 2rem', borderRadius: '50px' }}>Volver al Hotel</button>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={16} /> Atrás
                    </button>
                ) : (
                    <h3 style={{ margin: 0 }}>Reservar Habitación</h3>
                )}
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Cancelar</button>
            </div>

            {/* Price summary */}
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6' }}>{room.type}</h4>
                {discountInfo ? (
                    <>
                        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>
                            {formatPrice(baseTotal)}
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 900 }}>
                            {formatPrice(finalPrice)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                            Ahorro: {formatPrice(discountAmount)} ({discountInfo.percentage}%)
                        </div>
                    </>
                ) : (
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>
                        {formatPrice(baseTotal)}
                    </div>
                )}
                {dates.checkIn && dates.checkOut && (
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                        Por {nights} {nights === 1 ? 'noche' : 'noches'}
                    </div>
                )}
            </div>

            {/* STEP 1: Fechas */}
            {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="input-group">
                        <label><CalendarIcon size={14} /> Check-in</label>
                        <input type="date" value={dates.checkIn} onChange={e => setDates({ ...dates, checkIn: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="input-group">
                        <label><CalendarIcon size={14} /> Check-out</label>
                        <input type="date" value={dates.checkOut} onChange={e => setDates({ ...dates, checkOut: e.target.value })} min={dates.checkIn || new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="input-group">
                        <label><Users size={14} /> Huéspedes</label>
                        <select value={guests} onChange={e => setGuests(parseInt(e.target.value))}>
                            {Array.from({ length: room.maxCapacity }).map((_, i) => (
                                <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'Adulto' : 'Adultos'}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        disabled={!dates.checkIn || !dates.checkOut}
                        className="btn-premium"
                        onClick={() => setStep(2)}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '12px' }}
                    >
                        Siguiente paso <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* STEP 2: Datos + Cupón */}
            {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="input-group">
                        <label>Nombre Completo</label>
                        <input type="text" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} placeholder="Ej. Juan Pérez" />
                    </div>
                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} placeholder="Para enviar la confirmación" />
                    </div>
                    <div className="input-group">
                        <label>Teléfono (WhatsApp)</label>
                        <input type="text" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} placeholder="+52 998 000 0000" />
                    </div>

                    {/* Discount Code Section */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.2rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Tag size={13} /> Código de Descuento
                        </p>
                        {discountInfo ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '0.8rem 1rem' }}>
                                <div>
                                    <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>¡{discountInfo.code} aplicado!</span>
                                    <div style={{ color: '#10b981', fontSize: '0.8rem' }}>-{discountInfo.percentage}% de descuento</div>
                                </div>
                                <button onClick={removeDiscount} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Ingresa tu código"
                                        value={discountCode}
                                        onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(''); }}
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}
                                    />
                                    <button
                                        onClick={handleValidateDiscount}
                                        disabled={validatingDiscount || !discountCode}
                                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0 1.2rem', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', whiteSpace: 'nowrap', opacity: (!discountCode || validatingDiscount) ? 0.5 : 1 }}
                                    >
                                        {validatingDiscount ? '...' : 'Aplicar'}
                                    </button>
                                </div>
                                {discountError && (
                                    <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>{discountError}</p>
                                )}
                            </>
                        )}
                    </div>

                    <button
                        disabled={!customer.name || !customer.email || !customer.phone}
                        className="btn-premium"
                        onClick={() => setStep(3)}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '12px' }}
                    >
                        Ir a Pago <CreditCard size={18} />
                    </button>
                </div>
            )}

            {/* STEP 3: Pago */}
            {step === 3 && (
                <div className="checkout-container">
                    {!gateways || gateways.activeGateways.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(244,63,94,0.1)', color: '#f43f5e', borderRadius: '12px', border: '1px solid rgba(244,63,94,0.3)' }}>
                            Este hotel no tiene métodos de pago configurados. Contacta soporte.
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {gateways.activeGateways.includes('stripe') && (
                                    <button
                                        onClick={() => setActiveTab('stripe')}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: activeTab === 'stripe' ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', color: activeTab === 'stripe' ? '#8b5cf6' : 'white', border: `1px solid ${activeTab === 'stripe' ? '#8b5cf6' : 'transparent'}`, cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Tarjeta
                                    </button>
                                )}
                                {gateways.activeGateways.includes('paypal') && (
                                    <button
                                        onClick={() => setActiveTab('paypal')}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: activeTab === 'paypal' ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)', color: activeTab === 'paypal' ? '#f59e0b' : 'white', border: `1px solid ${activeTab === 'paypal' ? '#f59e0b' : 'transparent'}`, cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        PayPal
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={handleSuccess}
                                style={{ width: '100%', padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', marginBottom: '1.5rem' }}
                            >
                                Simular Pago (Dev)
                            </button>

                            {activeTab === 'stripe' && stripePromise && clientSecret && (
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                                    <CheckoutForm clientSecret={clientSecret} amount={finalPrice} onPaymentSuccess={handleSuccess} />
                                </Elements>
                            )}

                            {activeTab === 'paypal' && gateways.paypalClientId && (
                                <PayPalScriptProvider options={{ clientId: gateways.paypalClientId, currency: "USD" }}>
                                    <div style={{ marginTop: '1rem', zIndex: 1, position: 'relative' }}>
                                        <PayPalButtons
                                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    intent: "CAPTURE",
                                                    purchase_units: [{
                                                        description: `Hotel ${hotel.name} - ${room.type}`,
                                                        amount: { currency_code: "USD", value: finalPrice.toString() }
                                                    }]
                                                });
                                            }}
                                            onApprove={async (data, actions) => {
                                                if (actions.order) {
                                                    await actions.order.capture();
                                                    await handleSuccess();
                                                }
                                            }}
                                        />
                                    </div>
                                </PayPalScriptProvider>
                            )}

                            {processing && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: '24px' }}>
                                    <Loader2 className="animate-spin" size={40} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
                                    <div>Verificando pago...</div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            <style jsx>{`
                .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-group label { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 0.4rem; }
                .input-group input, .input-group select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 12px; color: white; font-family: inherit; font-size: 1rem; }
            `}</style>
        </div>
    );
}
