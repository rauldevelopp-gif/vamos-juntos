import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// In-memory OTP store — in production replace with Redis or a DB table
const otpStore = new Map<string, { code: string; expiresAt: number }>();

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, email, code, newPassword } = body;

        // ── SEND RECOVERY OTP ──────────────────────────────
        if (action === 'send') {
            if (!email) {
                return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
            }

            // Check if user exists
            const existingUser = await prisma.user.findFirst({
                where: { OR: [{ email: email }, { username: email }] }
            });

            if (!existingUser) {
                // For security reasons, don't reveal if the user exists or not, just return success
                return NextResponse.json({ success: true, message: 'Si el correo existe, se enviará un código' });
            }

            const otp = generateOTP();
            const expiresAt = Date.now() + 4 * 60 * 1000; // 4 minutes

            otpStore.set(email.toLowerCase(), { code: otp, expiresAt });

            const { error } = await resend.emails.send({
                from: process.env.RESEND_FROM || 'VamosJuntos <onboarding@resend.dev>',
                to: [existingUser.email || email], // Send to their actual registered email
                subject: `${otp} — Recuperación de contraseña VamosJuntos`,
                html: `
                    <div style="font-family: Arial, sans-serif; background: #05070a; color: #f8fafc; padding: 2rem; border-radius: 16px; max-width: 480px; margin: 0 auto;">
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <h1 style="font-size: 1.8rem; font-weight: 800; margin: 0; color: #8b5cf6;">VAMOS JUNTOS</h1>
                            <p style="color: #94a3b8; margin-top: 0.5rem; font-size: 0.9rem;">Recuperación de contraseña</p>
                        </div>
                        <div style="background: #0f0f1a; border: 1px solid rgba(139,92,246,0.3); border-radius: 12px; padding: 2rem; text-align: center;">
                            <p style="color: #94a3b8; margin-bottom: 1rem; font-size: 0.95rem;">Tu código para recuperar la contraseña es:</p>
                            <div style="font-size: 3rem; font-weight: 900; letter-spacing: 0.5rem; color: #8b5cf6; margin: 1rem 0; font-family: monospace;">${otp}</div>
                            <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 1rem;">
                                ⏱ Válido por <strong style="color: #f8fafc;">4 minutos</strong>.<br/>
                                Si no solicitaste este cambio, ignora este mensaje.
                            </p>
                        </div>
                    </div>
                `,
            });

            if (error) {
                console.error('Resend error:', error);
                return NextResponse.json({ error: 'Error al enviar el correo.' }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Código enviado' });
        }

        // ── VERIFY OTP & CHANGE PASSWORD ─────────────
        if (action === 'verify') {
            if (!email || !code || !newPassword) {
                return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
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

            // OTP valid — find user and update password
            const existingUser = await prisma.user.findFirst({
                where: { OR: [{ email: email }, { username: email }] }
            });

            if (!existingUser) {
                return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
            }

            const newHashed = crypto.createHash('sha256').update(newPassword).digest('hex');

            await prisma.user.update({
                where: { id: existingUser.id },
                data: { password: newHashed }
            });

            // Clear OTP
            otpStore.delete(email.toLowerCase());
            return NextResponse.json({ 
                success: true, 
                message: 'Contraseña actualizada exitosamente',
            });
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

    } catch (error) {
        console.error('Recover password error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
