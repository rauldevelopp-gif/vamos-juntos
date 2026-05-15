import React, { useState } from 'react';
import { TourPackage, Booking } from '../types';
import { createPackageReservation } from '../../admin/package/actions';
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

interface BookingWizardProps {
  pkg: TourPackage;
  onClose: () => void;
  onComplete: (booking: Booking) => void;
}

export const BookingSummary: React.FC<{ pkg: TourPackage, passengers: number, date: string }> = ({ pkg, passengers, date }) => {
  return (
    <div className="summary-box">
      <h3>Resumen de Reserva</h3>
      
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
        <div className="detail-item"><span>Fecha</span><strong>{date || '--/--/----'}</strong></div>
        <div className="detail-item"><span>Hora de Inicio</span><strong>{pkg.startTime}</strong></div>
        <div className="detail-item"><span>Pasajeros</span><strong>{passengers} pax</strong></div>
        <div className="detail-item"><span>Vehículo</span><strong>{pkg.vehicle.name}</strong></div>
      </div>

      <div className="summary-total-breakdown">
        <div className="detail-item"><span>Monto Base</span><strong>${pkg.price} USD</strong></div>
        <div className="detail-item"><span>Cargo Operativo (5%)</span><strong>${(pkg.price * 0.05).toFixed(2)} USD</strong></div>
      </div>

      <div className="summary-total">
        <span>Total a Pagar</span>
        <div className="price-wrap">
          <span className="amount">${(pkg.price * 1.05).toFixed(2)}</span>
          <span className="currency">USD</span>
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

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    const basePrice = pkg.price;
    const feeAmount = basePrice * 0.05;
    const totalPrice = basePrice + feeAmount;

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
      notes: formData.notes
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
            <span className="btn-text">Volver</span>
          </button>
          
          <div className="steps-indicator">
            {[1, 2, 3].map((s) => (
              <div key={s} className="step-item">
                <div className={`step-number ${step >= s ? 'active' : ''}`}>
                  {s}
                </div>
                <span className={`step-label ${step >= s ? 'active' : ''}`}>
                  {s === 1 ? 'Fecha' : s === 2 ? 'Datos' : 'Confirmar'}
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
                <h2>Planifica tu Experiencia</h2>
                <div className="input-grid single">
                  <div className="input-group">
                    <label><Calendar size={12} /> Selecciona la Fecha</label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]} 
                      value={formData.date} 
                      onChange={e => setFormData({...formData, date: e.target.value})} 
                    />
                  </div>
                  <div className="info-badge-simple">
                    <Clock size={16} />
                    <p>Hora de inicio programada: <strong>{pkg.startTime}</strong></p>
                  </div>
                </div>
                <div className="pax-selector">
                  <label><Users size={12} /> Número de Pasajeros</label>
                  <div className="pax-grid">
                    {[...Array(Math.min(pkg.maxPassengers, 8))].map((_, i) => (
                      <button key={i} onClick={() => setFormData({...formData, passengers: i + 1})} className={formData.passengers === i + 1 ? 'active' : ''}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <p className="capacity-note">Capacidad máxima del transporte: <strong>{pkg.maxPassengers} pasajeros</strong></p>
                </div>
                <div className="nav-actions">
                  <button disabled={!formData.date} onClick={nextStep} className="btn-primary">
                    Siguiente Paso <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h2>Tus Datos</h2>
                <div className="input-grid">
                  <div className="input-group">
                    <label>Nombre</label>
                    <input type="text" placeholder="Ej. Juan" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Apellido</label>
                    <input type="text" placeholder="Ej. Pérez" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label><Mail size={12} /> Email</label>
                    <input type="email" placeholder="email@ejemplo.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label><Phone size={12} /> Teléfono</label>
                    <input type="tel" placeholder="+52 --- --- ----" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="input-group full">
                    <label><Globe size={12} /> País</label>
                    <input type="text" placeholder="Ej. México" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                  </div>
                  <div className="input-group full">
                    <label><FileText size={12} /> Notas (Opcional)</label>
                    <textarea placeholder="Peticiones especiales..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                  </div>
                </div>
                <div className="nav-actions split">
                  <button onClick={prevStep} className="btn-secondary">Atrás</button>
                  <button disabled={!formData.firstName || !formData.email || !formData.phone} onClick={nextStep} className="btn-primary flex-1">
                    Confirmar Datos <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h2>Confirmación</h2>
                <div className="final-review-card">
                  <div className="review-grid">
                    <div className="review-item full-width">
                      <p className="label">Itinerario Detallado</p>
                      <div className="itinerary-preview-list">
                        <div className="itinerary-point start">
                          <Clock size={14} />
                          <div className="point-content">
                            <span className="point-title">Hora de Salida</span>
                            <span className="point-val">{pkg.startTime}</span>
                          </div>
                        </div>
                        <div className="itinerary-point">
                          <MapPin size={14} className="text-emerald-500" />
                          <div className="point-content">
                            <span className="point-title">Punto de Recogida</span>
                            <span className="point-val">{pkg.pickup.name}</span>
                          </div>
                        </div>
                        {pkg.items.map((item, idx) => (
                          <div key={item.id} className="itinerary-point">
                            <div className="point-dot-wrap"><div className="point-dot" /></div>
                            <div className="point-content">
                              <span className="point-title">Parada {idx + 1}</span>
                              <span className="point-val">{item.name}</span>
                            </div>
                          </div>
                        ))}
                        <div className="itinerary-point end">
                          <MapPin size={14} className="text-rose-500" />
                          <div className="point-content">
                            <span className="point-title">Destino Final</span>
                            <span className="point-val">{pkg.dropoff.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="review-item">
                      <p className="label">Titular de la Reserva</p>
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
                      <p className="badge-t">Reserva Protegida</p>
                      <p className="badge-s">Bloquearemos la disponibilidad de inmediato.</p>
                    </div>
                  </div>
                </div>
                <div className="nav-actions split">
                  <button onClick={prevStep} className="btn-secondary">Atrás</button>
                  <button onClick={handleSubmit} className="btn-primary success flex-1">
                    Confirmar Ahora <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="summary-column">
            <BookingSummary pkg={pkg} passengers={formData.passengers} date={formData.date} />
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

export const SuccessStep: React.FC<{ booking: Booking; onReset: () => void }> = ({ booking, onReset }) => {
  const [paymentState, setPaymentState] = useState<'pending' | 'processing' | 'success'>('pending');
  const [cardInfo, setCardInfo] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  const handleDownloadPDF = () => {
    window.print();
  };

  const simulatePayment = async () => {
    setPaymentState('processing');
    
    // We already calculated these in handleSubmit
    const basePrice = booking.snapshot.price;
    const feeAmount = booking.totalPrice - basePrice;

    try {
      await createPackageReservation({
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
        notes: booking.notes || ''
      });
    } catch (error) {
      console.error('Failed to save reservation', error);
    }

    setTimeout(() => {
      setPaymentState('success');
    }, 1500);
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
            <h2>Pago Requerido</h2>
            <p>Tu reserva está casi lista. Por favor, completa el pago seguro para confirmar tu itinerario.</p>
          </div>

          <div className="success-info-panel" style={{ textAlign: 'left', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Total a Pagar</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>
                  ${(booking as Booking).totalPrice || 0} <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>USD</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ padding: '0.3rem 0.6rem', background: '#1a1a1a', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', height: 'fit-content' }}>
                  <span style={{ color: '#253b80', fontWeight: 900, fontSize: '0.6rem', italic: 'true' }}>VISA</span>
                </div>
                <div style={{ padding: '0.3rem 0.6rem', background: '#1a1a1a', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', height: 'fit-content', display: 'flex' }}>
                   <div style={{ width: '8px', height: '8px', background: '#eb001b', borderRadius: '50%', marginRight: '-4px' }}></div>
                   <div style={{ width: '8px', height: '8px', background: '#f79e1b', borderRadius: '50%', opacity: 0.8 }}></div>
                </div>
              </div>
            </div>

            <div className="card-form">
              <div className="input-group">
                <label>Nombre del Titular</label>
                <input 
                  type="text" 
                  placeholder="Como aparece en la tarjeta"
                  value={cardInfo.name}
                  onChange={e => setCardInfo({...cardInfo, name: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label>Número de Tarjeta</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardInfo.number}
                    onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');
                      val = val.replace(/(.{4})/g, '$1 ').trim();
                      setCardInfo({...cardInfo, number: val});
                    }}
                  />
                  <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}>
                    <CreditCard size={18} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Vencimiento</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardInfo.expiry}
                    onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
                      setCardInfo({...cardInfo, expiry: val});
                    }}
                  />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <input 
                    type="password" 
                    placeholder="***"
                    maxLength={4}
                    value={cardInfo.cvv}
                    onChange={e => setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={simulatePayment} 
              className="btn-primary" 
              style={{ width: '100%', marginBottom: '1rem', background: '#8b5cf6', marginTop: '1rem' }}
              disabled={!cardInfo.name || cardInfo.number.length < 16 || !cardInfo.expiry || !cardInfo.cvv}
            >
              Confirmar Pago <ArrowRight size={18} />
            </button>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>
              <ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Pago encriptado SSL de 256 bits. Modo de prueba.
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
          .card-form { display: flex; flex-direction: column; gap: 1.25rem; }
          .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
          .input-group label { font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.05em; }
          .input-group input { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; border-radius: 14px; color: white; font-size: 0.9rem; font-weight: 600; outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box; }
          .input-group input:focus { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); }
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Procesando pago...</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Por favor, no cierres esta ventana.</p>
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
          <h2>¡Reserva Exitosa!</h2>
          <p>Hemos recibido tu solicitud. Un especialista se pondrá en contacto contigo en breve.</p>
        </div>

        <div className="success-info-panel">
          <div className="info-header">
            <span>Código de Reserva</span>
            <strong className="code">#{booking.id}</strong>
          </div>
          <div className="info-body">
            <div className="info-row">
              <div className="info-label-group"><CheckCircle2 size={12} className="text-emerald-500" /> <span>Estado</span></div>
              <span className="status">Confirmado</span>
            </div>
            <div className="info-row">
              <div className="info-label-group"><Sparkles size={12} className="text-violet-500" /> <span>Tour</span></div>
              <strong>{booking.packageName}</strong>
            </div>
            <div className="info-row">
              <div className="info-label-group"><Calendar size={12} className="text-violet-500" /> <span>Fecha</span></div>
              <strong>{booking.reservationDate}</strong>
            </div>
            <div className="info-row">
              <div className="info-label-group"><Clock size={12} className="text-violet-500" /> <span>Inicio</span></div>
              <strong>{booking.reservationTime}</strong>
            </div>
            <div className="info-row">
              <div className="info-label-group"><Users size={12} className="text-violet-500" /> <span>Pasajeros</span></div>
              <strong>{booking.passengers} pax</strong>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button onClick={handleDownloadPDF} className="btn-sec">
            PDF
          </button>
          <a href={`https://wa.me/529981234567?text=Hola, mi código de reserva es ${booking.id}`} target="_blank" className="btn-wa">
            WhatsApp
          </a>
        </div>

        <div className="footer-links">
          <button onClick={onReset} className="reset-btn">Volver al Catálogo</button>
          <div className="dot-sep" />
          <button onClick={() => window.location.href = '/'} className="home-btn">
            <Home size={14} /> Ir al Inicio
          </button>
        </div>
      </div>

      <style jsx>{`
        .success-overlay { 
            position: fixed; 
            inset: 0; 
            background: #050505; 
            z-index: 20000; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: flex-start;
            padding: 4rem 2rem; 
            color: white; 
            text-align: center; 
            overflow-y: auto;
        }
        .success-card { max-width: 450px; width: 100%; margin: auto 0; }
        
        .success-icon-container { position: relative; width: 6rem; height: 6rem; margin: 0 auto 3rem; display: flex; align-items: center; justify-content: center; }
        .success-icon { z-index: 2; width: 100%; height: 100%; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4); }
        .ping-effect { position: absolute; inset: -0.8rem; border-radius: 50%; border: 2px solid rgba(16, 185, 129, 0.3); animation: ping 2s infinite; z-index: 1; }
        @keyframes ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

        h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.02em; }
        p { color: rgba(255,255,255,0.5); margin-bottom: 3rem; line-height: 1.6; font-size: 1.1rem; }

        .success-info-panel { background: #111; border: 1px solid rgba(255,255,255,0.08); border-radius: 32px; padding: 2.5rem; margin-bottom: 3rem; text-align: left; }
        .info-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
        .info-header span { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; }
        .code { color: #8b5cf6; font-size: 1.4rem; font-weight: 900; }
        
        .info-body { display: flex; flex-direction: column; gap: 1.25rem; }
        .info-row { display: flex; justify-content: space-between; font-size: 0.85rem; align-items: center; }
        .info-label-group { display: flex; align-items: center; gap: 0.6rem; }
        .info-label-group span { color: rgba(255,255,255,0.4); font-weight: 700; text-transform: uppercase; font-size: 0.7rem; }
        .status { color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.25rem 0.75rem; border-radius: 6px; font-weight: 900; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; }

        .success-actions { display: flex; gap: 1.25rem; margin-bottom: 4rem; }
        .btn-sec { flex: 1; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); color: white; padding: 1.5rem; border-radius: 20px; font-weight: 900; text-transform: uppercase; cursor: pointer; font-size: 0.8rem; }
        .btn-wa { flex: 1; background: #10b981; color: white; border: none; padding: 1.5rem; border-radius: 20px; font-weight: 900; text-decoration: none; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; text-transform: uppercase; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }

        .footer-links { display: flex; align-items: center; justify-content: center; gap: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .dot-sep { width: 4px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 50%; }
        
        .reset-btn, .home-btn { background: transparent; border: none; color: rgba(255,255,255,0.3); text-transform: uppercase; font-weight: 900; letter-spacing: 0.2em; font-size: 0.7rem; cursor: pointer; transition: all 0.3s; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
        .reset-btn:hover, .home-btn:hover { color: white; }

        @media (max-width: 768px) {
            .success-overlay { padding: 2rem 1.5rem; }
            h2 { font-size: 2rem; }
            .success-actions { flex-direction: column; }
            .footer-links { flex-direction: column; gap: 1.5rem; }
            .dot-sep { display: none; }
        }

        @media print {
            .success-overlay { background: white; color: black; position: relative; display: block; padding: 0; }
            .success-actions, .footer-links, .ping-effect { display: none !important; }
            .code { color: black; }
        }
      `}</style>
    </div>
  );
};
