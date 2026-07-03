'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FloatingConcierge() {
    const { language } = useLanguage();
    const isEn = language === 'en';
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Retrasar la aparición del botón para que no interrumpa la carga inicial
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    // Número del Concierge. Lo toma de las variables de entorno o usa uno de respaldo.
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '529981234567';
    const defaultMessage = isEn 
        ? "Hello, I am browsing the website and would like to speak with a Personal Concierge regarding a VIP package." 
        : "Hola, estoy viendo la página web y me gustaría hablar con un Concierge Personal sobre un paquete VIP.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

    return (
        <div 
            className={`concierge-wrapper ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="concierge-button"
            >
                <div className="icon-container">
                    <MessageCircle size={28} color="white" fill="white" />
                    <span className="online-indicator"></span>
                </div>
                <div className="text-container">
                    <span className="title">{isEn ? "Personal Concierge" : "Concierge Personal"}</span>
                    <span className="subtitle">{isEn ? "Online now • Tap to chat" : "En línea ahora • Toca para hablar"}</span>
                </div>
            </a>

            <style jsx>{`
                .concierge-wrapper {
                    position: fixed;
                    bottom: 7rem;
                    right: 2rem;
                    z-index: 9999;
                    font-family: inherit;
                    animation: float-up 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }

                @keyframes float-up {
                    from { transform: translateY(100px) scale(0.8); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }

                .concierge-button {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    border: 1px solid rgba(139, 92, 246, 0.3);
                    padding: 0.75rem 1.5rem 0.75rem 0.75rem;
                    border-radius: 50px;
                    text-decoration: none;
                    box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                }

                .concierge-wrapper.hovered .concierge-button {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.4);
                    border-color: rgba(139, 92, 246, 0.6);
                }

                .icon-container {
                    position: relative;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
                    flex-shrink: 0;
                }

                .online-indicator {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 12px;
                    height: 12px;
                    background: #10b981;
                    border: 2px solid #0f172a;
                    border-radius: 50%;
                    animation: pulse-online 2s infinite;
                }

                @keyframes pulse-online {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }

                .text-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    overflow: hidden;
                    white-space: nowrap;
                    max-width: 0;
                    opacity: 0;
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                /* Mobile ALWAYS shows the text, Desktop shows on hover or after a delay */
                @media (min-width: 768px) {
                    .concierge-wrapper.hovered .text-container {
                        max-width: 200px;
                        opacity: 1;
                    }
                }

                @media (max-width: 767px) {
                    .concierge-wrapper {
                        bottom: 6.5rem;
                        right: 1.5rem;
                    }
                    .text-container {
                        max-width: 200px;
                        opacity: 1;
                    }
                    .concierge-button {
                        padding: 0.6rem 1.2rem 0.6rem 0.6rem;
                    }
                }

                .title {
                    color: white;
                    font-weight: 800;
                    font-size: 0.95rem;
                    letter-spacing: 0.02em;
                    margin-bottom: 0.1rem;
                }

                .subtitle {
                    color: #10b981;
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
            `}</style>
        </div>
    );
}
