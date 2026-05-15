import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// In-memory OTP store — in production replace with Redis or a DB table
const otpStore = new Map<string, { code: string; expiresAt: number; userData?: unknown }>();

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, email, code, userData } = body;

        // ── SEND OTP ──────────────────────────────
        if (action === 'send') {
            if (!email) {
                return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
            }

            // Check if user already exists before sending OTP
            const existing = await prisma.user.findFirst({
                where: { OR: [{ email: email }, { username: email }] }
            });

            if (existing) {
                return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 400 });
            }

            const otp = generateOTP();
            const expiresAt = Date.now() + 4 * 60 * 1000; // 4 minutes

            otpStore.set(email.toLowerCase(), { code: otp, expiresAt, userData });

            const { error } = await resend.emails.send({
                from: process.env.RESEND_FROM || 'VamosJuntos <onboarding@resend.dev>',
                to: [email],
                subject: `${otp} — Tu código de verificación VamosJuntos`,
                html: `
                    <div style="font-family: Arial, sans-serif; background: #05070a; color: #f8fafc; padding: 2rem; border-radius: 16px; max-width: 480px; margin: 0 auto;">
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <h1 style="font-size: 1.8rem; font-weight: 800; margin: 0; color: #8b5cf6;">VAMOS JUNTOS</h1>
                            <p style="color: #94a3b8; margin-top: 0.5rem; font-size: 0.9rem;">Verificación de cuenta</p>
                        </div>
                        <div style="background: #0f0f1a; border: 1px solid rgba(139,92,246,0.3); border-radius: 12px; padding: 2rem; text-align: center;">
                            <p style="color: #94a3b8; margin-bottom: 1rem; font-size: 0.95rem;">Tu código de verificación es:</p>
                            <div style="font-size: 3rem; font-weight: 900; letter-spacing: 0.5rem; color: #8b5cf6; margin: 1rem 0; font-family: monospace;">${otp}</div>
                            <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 1rem;">
                                ⏱ Válido por <strong style="color: #f8fafc;">4 minutos</strong>.<br/>
                                No compartas este código con nadie.
                            </p>
                        </div>
                        <p style="color: #475569; font-size: 0.75rem; text-align: center; margin-top: 1.5rem;">
                            Si no solicitaste este registro, ignora este mensaje.
                        </p>
                    </div>
                `,
            });

            if (error) {
                console.error('Resend error:', error);
                return NextResponse.json({ error: 'Error al enviar el correo. Verifica el API key.' }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Código enviado' });
        }

        // ── VERIFY OTP & PERSIST USER ─────────────
        if (action === 'verify') {
            if (!email || !code) {
                return NextResponse.json({ error: 'Email y código requeridos' }, { status: 400 });
            }

            const record = otpStore.get(email.toLowerCase());

            if (!record) {
                return NextResponse.json({ error: 'No hay un código activo para este correo.' }, { status: 400 });
            }

            if (Date.now() > record.expiresAt) {
                otpStore.delete(email.toLowerCase());
                return NextResponse.json({ error: 'El código ha expirado. Solicita uno nuevo.' }, { status: 400 });
            }

            if (record.code !== code.trim()) {
                return NextResponse.json({ error: 'Código incorrecto. Intenta de nuevo.' }, { status: 400 });
            }

            // OTP valid — Persist User to Database
            const uData = record.userData || {};
            const tempPassword = Math.random().toString(36).slice(-8); // Generate an 8-char random password
            const hashedPassword = crypto.createHash('sha256').update(tempPassword).digest('hex');

            await prisma.user.create({
                data: {
                    username: email,
                    email: email,
                    name: uData.fullName || 'Usuario',
                    password: hashedPassword,
                    role: (uData.userType || 'OPERATOR').toUpperCase(),
                }
            });

            // Clear OTP
            otpStore.delete(email.toLowerCase());
            return NextResponse.json({ 
                success: true, 
                message: 'Verificación exitosa',
                tempPassword: tempPassword // Send back so we can show it to the user
            });
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

    } catch (error) {
        console.error('OTP error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

