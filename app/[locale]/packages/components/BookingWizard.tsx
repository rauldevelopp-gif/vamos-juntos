import React, { useState, useEffect } from 'react';
import { TourPackage, Booking } from '../types';
import Link from 'next/link';
import { createPackageReservation } from '../../admin/package/actions';
import { validateDiscountCode } from '../../admin/discounts/actions';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  CreditCard,
  Clock,
  Globe,
  FileText,
  Sparkles,
  Home,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../../../../context/LanguageContext';
import { useCurrency } from '../../../../context/CurrencyContext';

interface BookingWizardProps {
  pkg: TourPackage;
  onClose: () => void;
  onComplete: (booking: Booking) => void;
}

export const BookingSummary: React.FC<{ pkg: TourPackage, passengers: number, date: string, discountInfo: { code: string, percentage: number } | null }> = ({ pkg, passengers, date, discountInfo }) => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const isEn = language === 'en';

  const basePrice = pkg.price;
  const feeAmount = basePrice * 0.05;
  let totalPrice = basePrice + feeAmount;
  let discountAmount = 0;

  if (discountInfo) {
    discountAmount = totalPrice * (discountInfo.percentage / 100);
    totalPrice -= discountAmount;
  }
  return (
    <div className="summary-box">
      <h3>{isEn ? "Booking Summary" : "Resumen de Reserva"}</h3>
      
      <div className="summary-pkg">
        <Image 
          src={pkg.image} 
          alt={pkg.name} 
          width={80}
          height={80}
          style={{ borderRadius: '16px', objectFit: 'cover' }}
          unoptimized
        />
        <div>
          <h4>{pkg.name}</h4>
          <p>{pkg.duration}</p>
        </div>
      </div>

      <div className="summary-details">
        <div className="detail-item"><span>{isEn ? "Date" : "Fecha"}</span><strong>{date || '--/--/----'}</strong></div>
        <div className="detail-item"><span>{isEn ? "Start Time" : "Hora de Inicio"}</span><strong>{pkg.startTime}</strong></div>
        <div className="detail-item"><span>{isEn ? "Passengers" : "Pasajeros"}</span><strong>{passengers} pax</strong></div>
        <div className="detail-item"><span>{isEn ? "Vehicle" : "Vehículo"}</span><strong>{pkg.vehicle.name}</strong></div>
      </div>

      <div className="summary-total-breakdown">
        <div className="detail-item"><span>{isEn ? "Base Amount" : "Monto Base"}</span><strong>{formatPrice(pkg.price)}</strong></div>
        <div className="detail-item"><span>{isEn ? "Operating Fee (5%)" : "Cargo Operativo (5%)"}</span><strong>{formatPrice(pkg.price * 0.05)}</strong></div>
        {discountInfo && (
            <div className="detail-item">
                <span style={{ color: '#10b981' }}>{isEn ? "Discount" : "Descuento"} ({discountInfo.percentage}%)</span>
                <strong style={{ color: '#10b981' }}>-{formatPrice(discountAmount)}</strong>
            </div>
        )}
      </div>

      <div className="summary-total">
        <span>{isEn ? "Total to Pay" : "Total a Pagar"}</span>
        <div className="price-wrap">
          <span className="amount">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <style jsx>{`
        .summary-box { background: #151515; border: 1px solid rgba(255,255,255,0.1); border-radius: 32px; padding: 2rem; position: sticky; top: 2rem; }
        h3 { font-size: 0.8rem; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; }
        .summary-pkg { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .summary-pkg img { width: 5rem; height: 5rem; border-radius: 16px; object-fit: cover; }
        .summary-pkg h4 { font-size: 0.9rem; color: white; font-weight: 700; margin-bottom: 0.25rem; }
        .summary-pkg p { font-size: 0.7rem; color: #8b5cf6; font-weight: 900; text-transform: uppercase; }
        .summary-details { margin-bottom: 1.5rem; }
        .summary-total-breakdown { margin-bottom: 2rem; padding-top: 1.5rem; border-top: 1px dashed rgba(255,255,255,0.1); }
        .detail-item { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.75rem; }
        .detail-item span { color: rgba(255,255,255,0.4); font-weight: 700; text-transform: uppercase; font-size: 0.7rem; }
        .detail-item strong { color: white; }
        .summary-total { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem; display: flex; justify-content: space-between; align-items: flex-end; }
        .summary-total span { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 900; text-transform: uppercase; }
        .price-wrap { text-align: right; }
        .amount { font-size: 1.75rem; font-weight: 900; color: #8b5cf6; }
        .currency { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 700; margin-left: 0.25rem; }
      `}</style>
    </div>
  );
};

export const BookingWizard: React.FC<BookingWizardProps> = ({ pkg, onClose, onComplete }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    passengers: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    notes: ''
  });
  const [discountCode, setDiscountCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState<{ code: string, percentage: number } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [validatingDiscount, setValidatingDiscount] = useState(false);

  const handleValidateDiscount = async () => {
    if (!discountCode) return;
    setValidatingDiscount(true);
    setDiscountError('');
    const res = await validateDiscountCode(discountCode.toUpperCase(), pkg.id);
    if (res.success && res.data) {
        setDiscountInfo({ code: res.data.code, percentage: res.data.discount });
    } else {
        setDiscountError(res.error || (isEn ? 'Invalid code' : 'Código inválido'));
        setDiscountInfo(null);
    }
    setValidatingDiscount(false);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    const basePrice = pkg.price;
    const feeAmount = basePrice * 0.05;
    let totalPrice = basePrice + feeAmount;
    if (discountInfo) {
      totalPrice -= totalPrice * (discountInfo.percentage / 100);
    }

    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      packageId: pkg.id,
      packageName: pkg.name,
      reservationDate: formData.date,
      reservationTime: pkg.startTime,
      passengers: formData.passengers,
      totalPrice: totalPrice,
      status: 'pending',
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
      },
      snapshot: {
        packageName: pkg.name,
        vehicle: pkg.vehicle.name,
        driver: pkg.driver.name,
        pickup: pkg.pickup.name,
        dropoff: pkg.dropoff.name,
        items: pkg.items.map(i => i.name),
        price: basePrice
      },
      notes: formData.notes,
      discountCode: discountInfo?.code
    };
    onComplete(booking);
  };

  return (
    <div className="wizard-overlay">
      {/* Header */}
      <header className="wizard-header">
        <div className="header-container">
          <button onClick={onClose} className="back-btn">
            <ArrowLeft size={20} />
            <span className="btn-text">{isEn ? "Back" : "Volver"}</span>
          </button>
          
          <div className="steps-indicator">
            {[1, 2, 3].map((s) => (
              <div key={s} className="step-item">
                <div className={`step-number ${step >= s ? 'active' : ''}`}>
                  {s}
                </div>
                <span className={`step-label ${step >= s ? 'active' : ''}`}>
                  {s === 1 ? (isEn ? 'Date' : 'Fecha') : s === 2 ? (isEn ? 'Data' : 'Datos') : (isEn ? 'Confirm' : 'Confirmar')}
                </span>
                {s < 3 && <div className={`step-line ${step > s ? 'active' : ''}`} />}
              </div>
            ))}
          </div>
          <div className="header-spacer" />
        </div>
      </header>

      <main className="wizard-main custom-scrollbar">
        <div className="wizard-layout">
          <div className="form-column">
            {step === 1 && (
              <div className="form-step">
                <h2>{isEn ? "Plan Your Experience" : "Planifica tu Experiencia"}</h2>
                <div className="input-grid single">
                  <div className="input-group">
                    <label><Calendar size={12} /> {isEn ? "Select Date" : "Selecciona la Fecha"}</label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]} 
                      value={formData.date} 
                      onChange={e => setFormData({...formData, date: e.target.value})} 
                    />
                  </div>
                  <div className="info-badge-simple">
                    <Clock size={16} />
                    <p>{isEn ? "Scheduled start time: " : "Hora de inicio programada: "} <strong>{pkg.startTime}</strong></p>
                  </div>
                </div>
                <div className="pax-selector">
                  <label><Users size={12} /> {isEn ? "Number of Passengers" : "Número de Pasajeros"}</label>
                  <div className="pax-grid">
                    {[...Array(Math.min(pkg.maxPassengers, 8))].map((_, i) => (
                      <button key={i} onClick={() => setFormData({...formData, passengers: i + 1})} className={formData.passengers === i + 1 ? 'active' : ''}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <p className="capacity-note">{isEn ? "Maximum transport capacity: " : "Capacidad máxima del transporte: "} <strong>{pkg.maxPassengers} {isEn ? "passengers" : "pasajeros"}</strong></p>
                </div>
                <div className="nav-actions">
                  <button disabled={!formData.date} onClick={nextStep} className="btn-primary">
                    {isEn ? "Next Step" : "Siguiente Paso"} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h2>{isEn ? "Your Details" : "Tus Datos"}</h2>
                <div className="input-grid">
                  <div className="input-group">
                    <label>{isEn ? "First Name" : "Nombre"}</label>
                    <input type="text" placeholder={isEn ? "e.g. John" : "Ej. Juan"} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>{isEn ? "Last Name" : "Apellido"}</label>
                    <input type="text" placeholder={isEn ? "e.g. Doe" : "Ej. Pérez"} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label><Mail size={12} /> Email</label>
                    <input type="email" placeholder="email@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label><Phone size={12} /> {isEn ? "Phone" : "Teléfono"}</label>
                    <input type="tel" placeholder="+52 --- --- ----" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="input-group full">
                    <label><Globe size={12} /> {isEn ? "Country" : "País"}</label>
                    <input type="text" placeholder={isEn ? "e.g. United States" : "Ej. México"} value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                  </div>
                  <div className="input-group full">
                    <label><FileText size={12} /> {isEn ? "Notes (Optional)" : "Notas (Opcional)"}</label>
                    <textarea placeholder={isEn ? "Special requests..." : "Peticiones especiales..."} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                  </div>
                </div>
                <div className="nav-actions split">
                  <button onClick={prevStep} className="btn-secondary">{isEn ? "Back" : "Atrás"}</button>
                  <button disabled={!formData.firstName || !formData.email || !formData.phone} onClick={nextStep} className="btn-primary flex-1">
                    {isEn ? "Confirm Details" : "Confirmar Datos"} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h2>{isEn ? "Confirmation" : "Confirmación"}</h2>
                <div className="final-review-card">
                  <div className="review-grid">
                    <div className="review-item full-width">
                      <p className="label">{isEn ? "Detailed Itinerary" : "Itinerario Detallado"}</p>
                      <div className="itinerary-preview-list">
                        <div className="itinerary-point start">
                          <Clock size={14} />
                          <div className="point-content">
                            <span className="point-title">{isEn ? "Departure Time" : "Hora de Salida"}</span>
                            <span className="point-val">{pkg.startTime}</span>
                          </div>
                        </div>
                        <div className="itinerary-point">
                          <MapPin size={14} className="text-emerald-500" />
                          <div className="point-content">
                            <span className="point-title">{isEn ? "Pickup Point" : "Punto de Recogida"}</span>
                            <span className="point-val">{pkg.pickup.name}</span>
                          </div>
                        </div>
                        {pkg.items.map((item, idx) => (
                          <div key={item.id} className="itinerary-point">
                            <div className="point-dot-wrap"><div className="point-dot" /></div>
                            <div className="point-content">
                              <span className="point-title">{isEn ? `Stop ${idx + 1}` : `Parada ${idx + 1}`}</span>
                              <span className="point-val">{item.name}</span>
                            </div>
                          </div>
                        ))}
                        <div className="itinerary-point end">
                          <MapPin size={14} className="text-rose-500" />
                          <div className="point-content">
                            <span className="point-title">{isEn ? "Final Destination" : "Destino Final"}</span>
                            <span className="point-val">{pkg.dropoff.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="review-item">
                      <p className="label">{isEn ? "Booking Holder" : "Titular de la Reserva"}</p>
                      <div className="customer-review-card">
                        <p className="val">{formData.firstName} {formData.lastName}</p>
                        <p className="sub-val">{formData.email}</p>
                        <p className="sub-val">{formData.phone}</p>
                        <p className="sub-val">{formData.country}</p>
                      </div>
                    </div>
                  </div>
                    <div className="secure-badge">
                      <CreditCard size={20} />
                      <div>
                        <p className="badge-t">{isEn ? "Protected Reservation" : "Reserva Protegida"}</p>
                        <p className="badge-s">{isEn ? "We will lock availability immediately." : "Bloquearemos la disponibilidad de inmediato."}</p>
                      </div>
                    </div>
                  </div>

                  <div className="discount-section" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '1.5rem', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '1rem' }}>{isEn ? "Discount Code" : "Código de Descuento"}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input 
                        type="text" 
                        placeholder={isEn ? "Enter code" : "Ingresa tu código"} 
                        value={discountCode}
                        onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontWeight: 700 }}
                      />
                      <button 
                        onClick={handleValidateDiscount}
                        disabled={validatingDiscount || !discountCode}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0 1.5rem', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        {validatingDiscount ? '...' : (isEn ? 'Apply' : 'Aplicar')}
                      </button>
                    </div>
                    {discountError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>{discountError}</p>}
                    {discountInfo && <p style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>{isEn ? `Code ${discountInfo.code} applied! (-${discountInfo.percentage}%)` : `¡Código ${discountInfo.code} aplicado! (-${discountInfo.percentage}%)`}</p>}
                  </div>

                  <div className="nav-actions split">
                  <button onClick={prevStep} className="btn-secondary">{isEn ? "Back" : "Atrás"}</button>
                  <button onClick={handleSubmit} className="btn-primary success flex-1">
                    {isEn ? "Confirm Now" : "Confirmar Ahora"} <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="summary-column">
            <BookingSummary pkg={pkg} passengers={formData.passengers} date={formData.date} discountInfo={discountInfo} />
          </div>
        </div>
      </main>

      <style jsx>{`
        .wizard-overlay { position: fixed; inset: 0; background: #050505; z-index: 10000; overflow-y: auto; color: white; }
        .wizard-header { position: sticky; top: 0; z-index: 20; background: rgba(5, 5, 5, 0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .header-container { max-width: 1200px; margin: 0 auto; height: 5rem; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; }
        
        .back-btn { background: transparent; border: none; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; transition: all 0.3s; }
        .back-btn:hover { color: white; }

        .steps-indicator { display: flex; align-items: center; gap: 1.5rem; }
        .step-item { display: flex; align-items: center; gap: 0.5rem; position: relative; }
        .step-number { width: 1.75rem; height: 1.75rem; border-radius: 50%; background: #151515; color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 900; transition: all 0.3s; }
        .step-number.active { background: #8b5cf6; color: white; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
        .step-label { font-size: 0.6rem; font-weight: 900; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.1em; }
        .step-label.active { color: white; }
        .step-line { width: 1.5rem; height: 1px; background: rgba(255,255,255,0.05); margin: 0 0.25rem; }
        .step-line.active { background: #8b5cf6; }
        .header-spacer { width: 80px; }

        .wizard-main { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        .wizard-layout { display: flex; gap: 4rem; }
        .form-column { flex: 1; max-width: 650px; }
        .summary-column { width: 320px; }

        .form-step h2 { font-size: 2.2rem; font-weight: 900; margin-bottom: 2.5rem; }
        
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .input-grid.single { grid-template-columns: 1fr; max-width: 400px; }
        .input-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .input-group.full { grid-column: span 2; }
        .input-group label { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; }
        .input-group input, .input-group textarea { background: #111; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1rem 1.25rem; color: white; font-weight: 600; outline: none; font-size: 0.95rem; }
        .input-group input:focus { border-color: #8b5cf6; }
        .input-group textarea { min-height: 100px; resize: none; }

        .info-badge-simple { display: flex; align-items: center; gap: 1rem; background: rgba(139, 92, 246, 0.05); padding: 1rem 1.5rem; border-radius: 16px; color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.1); }
        .info-badge-simple p { font-size: 0.85rem; font-weight: 500; margin: 0; }
        .info-badge-simple strong { font-weight: 900; }

        .pax-selector { margin-top: 2.5rem; }
        .pax-selector label { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-bottom: 1.25rem; display: block; }
        .pax-grid { display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .pax-grid button { width: 3.2rem; height: 3.2rem; border-radius: 14px; background: #111; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); font-weight: 900; cursor: pointer; transition: all 0.2s; }
        .pax-grid button.active { background: #8b5cf6; color: white; border-color: #8b5cf6; }
        .capacity-note { font-size: 0.7rem; color: rgba(255,255,255,0.3); margin-top: 1rem; }

        .nav-actions { margin-top: 4rem; }
        .nav-actions.split { display: flex; gap: 1rem; }
        .btn-primary { background: #8b5cf6; color: white; border: none; padding: 1.25rem 2.5rem; border-radius: 18px; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; width: 100%; }
        .btn-primary:disabled { opacity: 0.3; }
        .btn-primary.success { background: #10b981; }
        .btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: white; padding: 1.25rem 2rem; border-radius: 18px; font-weight: 900; text-transform: uppercase; cursor: pointer; }

        .final-review-card { background: #111; border: 1px solid rgba(255,255,255,0.08); border-radius: 32px; padding: 2rem; margin-bottom: 2rem; }
        .review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 2.5rem; margin-bottom: 2rem; }
        .review-item.full-width { grid-column: span 2; }
        .review-item .label { font-size: 0.6rem; font-weight: 900; color: #8b5cf6; text-transform: uppercase; margin-bottom: 1.25rem; letter-spacing: 0.1em; }
        
        .itinerary-preview-list { display: flex; flex-direction: column; gap: 0.75rem; background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .itinerary-point { display: flex; align-items: flex-start; gap: 1rem; position: relative; }
        .itinerary-point.start { color: #8b5cf6; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
        .point-content { display: flex; flex-direction: column; }
        .point-title { font-size: 0.6rem; font-weight: 900; color: rgba(255,255,255,0.3); text-transform: uppercase; }
        .point-val { font-size: 0.85rem; font-weight: 700; color: white; }
        .point-dot-wrap { width: 14px; display: flex; justify-content: center; pt: 0.4rem; }
        .point-dot { width: 4px; height: 4px; background: #8b5cf6; border-radius: 50%; opacity: 0.5; }

        .customer-review-card .val { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.5rem; }
        .customer-review-card .sub-val { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 0.25rem; }

        .secure-badge { display: flex; align-items: center; gap: 1rem; background: rgba(139, 92, 246, 0.05); padding: 1.25rem; border-radius: 20px; color: #8b5cf6; }
        .badge-t { font-weight: 900; font-size: 0.85rem; }
        .badge-s { font-size: 0.7rem; opacity: 0.7; }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        @media (max-width: 768px) {
            .header-container { padding: 0 1rem; }
            .btn-text { display: none; }
            .header-spacer { width: 0; }
            .steps-indicator { gap: 0.75rem; }
            .step-label { display: none; }
            .step-line { width: 1rem; }
            
            .wizard-main { padding: 2rem 1rem; }
            .wizard-layout { flex-direction: column-reverse; gap: 2.5rem; }
            .summary-column { width: 100%; position: static; }
            .form-column { width: 100%; }
            .form-step h2 { font-size: 1.75rem; margin-bottom: 2rem; }
            .input-grid { grid-template-columns: 1fr; gap: 1.25rem; }
            .input-group.full { grid-column: span 1; }
            .review-grid { grid-template-columns: 1fr; gap: 1.5rem; }
            
            .nav-actions.split { flex-direction: column-reverse; }
            .btn-secondary { width: 100%; }
        }
      `}</style>
    </div>
  );
};

const StripeCheckoutForm = ({ clientSecret, onPaymentSuccess }: { clientSecret: string, onPaymentSuccess: () => void }) => {
    const { language } = useLanguage();
    const isEn = language === 'en';
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = React.useState<string | null>(null);
    const [processing, setProcessing] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);
        const cardElement = elements.getElement(CardElement);
        
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement!,
            }
        });

        if (stripeError) {
            setError(stripeError.message || (isEn ? 'Payment failed' : 'El pago ha fallado'));
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onPaymentSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '16px' }}>
                <CardElement options={{
                    style: {
                        base: {
                            color: '#fff',
                            fontFamily: 'system-ui, sans-serif',
                            fontSize: '16px',
                            '::placeholder': { color: 'rgba(255,255,255,0.4)' },
                            iconColor: '#8b5cf6',
                        },
                        invalid: { color: '#ef4444', iconColor: '#ef4444' },
                    },
                    hidePostalCode: true
                }} />
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>{error}</div>}
            <button type="submit" disabled={!stripe || processing} className="btn-primary" style={{ width: '100%', background: '#8b5cf6' }}>
                {processing ? (isEn ? 'Processing Payment...' : 'Procesando Pago...') : (isEn ? 'Pay Securely' : 'Pagar de forma Segura')}
            </button>
        </form>
    );
};

export const SuccessStep: React.FC<{ booking: Booking; onReset: () => void }> = ({ booking, onReset }) => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const isEn = language === 'en';

  const [paymentState, setPaymentState] = useState<'pending' | 'processing' | 'success'>('pending');
  const [config, setConfig] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'stripe' | 'paypal'>('stripe');
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState<any>(null);
  
  const [locatorCode, setLocatorCode] = useState<string>('');
  const [password, setPassword] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      fetch('/api/auth/me').then(r => r.json()).then(data => {
          if (data.success && data.user) setIsLoggedIn(true);
      }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/checkout/config?packageId=${booking.packageId}`)
      .then(r => r.json())
      .then(res => {
         if (res.success && res.data) {
             setConfig(res.data);
             if (res.data.activeGateways.includes('paypal') && !res.data.activeGateways.includes('stripe')) {
                 setActiveTab('paypal');
             }
             
             if (res.data.stripePublicKey) {
                 setStripePromise(loadStripe(res.data.stripePublicKey));
                 // Passing the currency alongside the USD amount to prepare for future multi-currency charge support
                 fetch('/api/checkout/stripe', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ 
                         packageId: booking.packageId, 
                         amount: booking.totalPrice,
                         currency: 'USD' // Base currency, backend will handle conversion if needed
                     })
                 }).then(r => r.json()).then(data => {
                     if (data.success) setClientSecret(data.clientSecret);
                 });
             }
         }
      });
  }, [booking.packageId, booking.totalPrice]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handlePaymentSuccess = async () => {
    setPaymentState('processing');
    const basePrice = booking.snapshot.price;
    const feeAmount = booking.totalPrice - basePrice;

    try {
      const res = await createPackageReservation({
        packageId: Number(booking.packageId) || 0,
        customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        customerEmail: booking.customer.email,
        customerPhone: booking.customer.phone,
        customerCountry: booking.customer.country,
        date: booking.reservationDate,
        time: booking.reservationTime,
        passengers: booking.passengers,
        totalPrice: booking.totalPrice,
        basePrice: basePrice,
        serviceFee: feeAmount,
        notes: booking.notes || '',
        discountCode: booking.discountCode
      });
      if (res.success && res.data) {
          setLocatorCode(res.data.locatorCode);
      }
      setPaymentState('success');
    } catch (error) {
      console.error('Failed to save reservation', error);
      alert(isEn ? 'There was an error saving your reservation.' : 'Hubo un error al registrar la reserva.');
    }
  };

  const handleClaimAccount = async () => {
      if (!password || password.length < 6) {
          alert(isEn ? 'Password must be at least 6 characters' : 'La contraseña debe tener al menos 6 caracteres');
          return;
      }
      setClaiming(true);
      try {
          const res = await fetch('/api/auth/claim', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  email: booking.customer.email,
                  name: `${booking.customer.firstName} ${booking.customer.lastName}`,
                  password,
                  locatorCode: locatorCode
              })
          });
          const data = await res.json();
          if (data.success) {
              setClaimSuccess(true);
          } else {
              alert(data.error || (isEn ? 'Error creating account' : 'Error al crear la cuenta'));
          }
      } catch (e) {
          alert(isEn ? 'Connection error' : 'Error de conexión');
      }
      setClaiming(false);
  };

  if (paymentState === 'pending') {
    return (
      <div className="success-overlay">
        <div className="success-card">
          <div className="success-icon-container" style={{ margin: '0 auto 2rem' }}>
            <div className="success-icon" style={{ background: '#8b5cf6', boxShadow: '0 15px 40px rgba(139, 92, 246, 0.4)' }}>
              <CreditCard size={36} color="white" />
            </div>
          </div>
          
          <div className="success-text">
            <h2>{isEn ? "Payment Required" : "Pago Requerido"}</h2>
            <p>{isEn ? "Your reservation is almost ready. Please complete the secure payment to confirm your itinerary." : "Tu reserva está casi lista. Por favor, completa el pago seguro para confirmar tu itinerario."}</p>
          </div>

          <div className="success-info-panel" style={{ textAlign: 'left', padding: '2rem' }}>
            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{isEn ? "Total to Pay" : "Total a Pagar"}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>
                  {formatPrice((booking as Booking).totalPrice || 0)}
                </div>
              </div>
            </div>

            {config ? (
                config.activeGateways.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                        {isEn ? "The provider of this package does not have active payment methods." : "El proveedor de este paquete no tiene métodos de pago configurados."}
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                            {config.activeGateways.includes('stripe') && (
                                <button 
                                    onClick={() => setActiveTab('stripe')}
                                    style={{ flex: 1, padding: '0.75rem', background: activeTab === 'stripe' ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: activeTab === 'stripe' ? '#8b5cf6' : 'white', border: `1px solid ${activeTab === 'stripe' ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    {isEn ? 'Card' : 'Tarjeta'}
                                </button>
                            )}
                            {config.activeGateways.includes('paypal') && (
                                <button 
                                    onClick={() => setActiveTab('paypal')}
                                    style={{ flex: 1, padding: '0.75rem', background: activeTab === 'paypal' ? 'rgba(0, 112, 186, 0.1)' : 'transparent', color: activeTab === 'paypal' ? '#0070ba' : 'white', border: `1px solid ${activeTab === 'paypal' ? '#0070ba' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    PayPal
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handlePaymentSuccess}
                            style={{ width: '100%', padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', marginBottom: '1.5rem' }}
                        >
                            {isEn ? "Simulate Payment (Dev)" : "Simular Pago (Dev)"}
                        </button>

                        {activeTab === 'stripe' && clientSecret && stripePromise && (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <StripeCheckoutForm clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess} />
                            </Elements>
                        )}
                        {activeTab === 'stripe' && !clientSecret && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>{isEn ? "Loading payment gateway..." : "Cargando pasarela de pago..."}</div>
                        )}

                        {activeTab === 'paypal' && config.paypalClientId && (
                            <div style={{ marginTop: '1.5rem', position: 'relative', zIndex: 1 }}>
                                <PayPalScriptProvider options={{ "clientId": config.paypalClientId, currency: "USD" }}>
                                    <PayPalButtons 
                                        style={{ layout: "vertical", shape: "rect", color: "gold" }}
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                intent: "CAPTURE",
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            currency_code: "USD",
                                                            value: booking.totalPrice.toString(),
                                                        },
                                                    },
                                                ],
                                            });
                                        }}
                                        onApprove={(data, actions) => {
                                            return actions.order!.capture().then((details) => {
                                                handlePaymentSuccess();
                                            });
                                        }}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        )}
                    </>
                )
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>{isEn ? "Fetching payment options..." : "Obteniendo métodos de pago..."}</div>
            )}

            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: '1.5rem 0 0 0' }}>
              <ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {isEn ? "Secure payments processed with SSL encryption." : "Pagos procesados de forma segura con cifrado SSL."}
            </p>
          </div>
        </div>
        <style jsx>{`
          .success-overlay { position: fixed; inset: 0; background: #050505; z-index: 20000; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 4rem 2rem; color: white; text-align: center; overflow-y: auto; }
          .success-card { max-width: 450px; width: 100%; margin: auto 0; }
          .success-icon-container { position: relative; width: 6rem; height: 6rem; display: flex; align-items: center; justify-content: center; }
          .success-icon { z-index: 2; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
          h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.02em; }
          p { color: rgba(255,255,255,0.5); margin-bottom: 2rem; line-height: 1.6; font-size: 1.1rem; }
          .success-info-panel { background: #111; border: 1px solid rgba(255,255,255,0.08); border-radius: 32px; }
          .btn-primary { color: white; border: none; padding: 1.25rem 2.5rem; border-radius: 18px; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; }
          .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4); }
          .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }
        `}</style>
      </div>
    );
  }

  if (paymentState === 'processing') {
    return (
      <div className="success-overlay">
        <div className="success-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', paddingTop: '4rem' }}>
          <div className="loader" style={{ margin: '0 auto 2rem' }}></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{isEn ? "Confirming reservation..." : "Confirmando reserva..."}</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>{isEn ? "Please do not close this window." : "Por favor, no cierres esta ventana."}</p>
        </div>
        <style jsx>{`
          .success-overlay { position: fixed; inset: 0; background: #050505; z-index: 20000; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 4rem 2rem; color: white; text-align: center; }
          .success-card { max-width: 450px; width: 100%; margin: auto 0; }
          .loader { width: 48px; height: 48px; border: 5px solid rgba(139, 92, 246, 0.2); border-bottom-color: #8b5cf6; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="success-overlay">
      <div className="success-card">
        <div className="success-icon-container">
          <div className="success-icon">
            <CheckCircle2 size={40} color="white" />
          </div>
          <div className="ping-effect" />
        </div>

        <div className="success-text">
          <h2>{isEn ? "Successful Booking!" : "¡Reserva Exitosa!"}</h2>
          <p>{isEn ? "We have received your request. A specialist will contact you shortly." : "Hemos recibido tu solicitud. Un especialista se pondrá en contacto contigo en breve."}</p>
        </div>

        <div className="success-info-panel">
          <div className="info-header">
            <span>{isEn ? "Booking Code / Locator" : "Código de Reserva / Localizador"}</span>
            <strong className="code">{locatorCode || `#${booking.id}`}</strong>
          </div>
          <div className="info-body">
            <div className="info-row">
              <span className="label">{isEn ? "Status" : "Estatus"}</span>
              <span className="val confirmed">
                <CheckCircle2 size={12} /> {isEn ? "Confirmed" : "Confirmado"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">{isEn ? "Itinerary" : "Itinerario"}</span>
              <span className="val">{booking.snapshot.packageName}</span>
            </div>
            <div className="info-row">
              <span className="label">{isEn ? "Date" : "Fecha"}</span>
              <span className="val">{booking.reservationDate}</span>
            </div>
            <div className="info-row">
              <span className="label">{isEn ? "Passengers" : "Pasajeros"}</span>
              <span className="val">{booking.passengers} pax</span>
            </div>
          </div>

          <div style={{ padding: '0 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={handleDownloadPDF}
              className="btn-glass" 
            >
              <FileText size={18} />
              {isEn ? "Print Voucher / Receipt" : "Imprimir Voucher / Recibo"}
            </button>
            <Link 
              href="/"
              className="btn-premium" 
            >
              <Home size={18} /> {isEn ? "Back to Homepage" : "Volver al Inicio"}
            </Link>
          </div>

          {/* Account Persistency Block for Claiming */}
          {!isLoggedIn && (
              !claimSuccess ? (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2rem', background: 'rgba(255,255,255,0.01)', borderRadius: '0 0 32px 32px' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 800 }}>{isEn ? "Create your Account" : "Crea tu Cuenta"}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                          {isEn 
                            ? "Save a password to track this reservation, request changes, and buy premium products."
                            : "Guarda una contraseña para dar seguimiento a esta reserva, solicitar cambios y comprar productos premium."}
                      </p>
                      <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                          <input 
                              type="password" 
                              placeholder={isEn ? "Minimum 6 characters" : "Mínimo 6 caracteres"}
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              style={{ width: '100%', padding: '0.8rem 1rem', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                          />
                          <button 
                              onClick={handleClaimAccount}
                              disabled={claiming || !password}
                              style={{ width: '100%', padding: '0.8rem', background: '#8b5cf6', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem' }}
                          >
                              {claiming ? '...' : (isEn ? 'Save Password & Create Account' : 'Guardar y Crear Cuenta')}
                          </button>
                      </div>
                  </div>
              ) : (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1.5rem', background: 'rgba(16, 185, 129, 0.03)', borderRadius: '0 0 32px 32px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
                      <CheckCircle2 size={16} />
                      <span>{isEn ? "Account created successfully! You can now log in." : "¡Cuenta creada con éxito! Ya puedes iniciar sesión."}</span>
                  </div>
              )
          )}
        </div>
      </div>
      <style jsx>{`
        .success-overlay { position: fixed; inset: 0; background: #050505; z-index: 20000; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 4rem 2rem; color: white; overflow-y: auto; }
        .success-card { max-width: 480px; width: 100%; margin: auto 0; }
        .success-icon-container { position: relative; width: 6rem; height: 6rem; margin: 0 auto 2.5rem; display: flex; align-items: center; justify-content: center; }
        .success-icon { z-index: 2; width: 100%; height: 100%; border-radius: 50%; background: #10b981; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4); }
        .ping-effect { position: absolute; inset: 0; border-radius: 50%; border: 2px solid #10b981; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes ping { 75%, 100% { transform: scale(1.4); opacity: 0; } }
        
        .success-text { text-align: center; }
        h2 { font-size: 2.2rem; font-weight: 900; margin-bottom: 0.5rem; }
        p { color: rgba(255,255,255,0.4); margin-bottom: 2.5rem; line-height: 1.6; font-size: 0.95rem; }
        .success-info-panel { background: #111; border: 1px solid rgba(255,255,255,0.08); border-radius: 32px; text-align: left; }
        .info-header { padding: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 0.5rem; }
        .info-header span { font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; }
        .info-header .code { font-size: 1.8rem; font-weight: 900; color: #8b5cf6; }
        .info-body { padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .info-row { display: flex; justify-content: space-between; font-size: 0.9rem; }
        .info-row .label { color: rgba(255,255,255,0.4); font-weight: 500; }
        .info-row .val { color: white; font-weight: 800; }
        .info-row .val.confirmed { color: #10b981; display: flex; alignItems: center; gap: 0.4rem; }
        
        .btn-primary { color: white; border: none; padding: 1.1rem; border-radius: 18px; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; }
        .btn-primary:hover { transform: translateY(-2px); }

        .btn-premium { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border: none; padding: 1.1rem; border-radius: 18px; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; text-decoration: none; box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.5); }
        .btn-premium:hover { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(139, 92, 246, 0.6); }

        .btn-glass { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 1.1rem; border-radius: 18px; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; backdrop-filter: blur(10px); }
        .btn-glass:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
      `}</style>
    </div>
  );
};
