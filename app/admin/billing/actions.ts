'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getGatewaySettings() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'No autorizado' };
        }

        let settings = await prisma.gatewaySettings.findUnique({
            where: { userId: user.id }
        });

        // Create default if not exists
        if (!settings) {
            settings = await prisma.gatewaySettings.create({
                data: {
                    userId: user.id,
                    activeGateways: []
                }
            });
        }

        revalidatePath('/admin', 'layout');
        return { success: true, data: settings };
    } catch (error) {
        console.error('Error fetching gateway settings:', error);
        return { success: false, error: 'Error al cargar configuración' };
    }
}

export async function saveGatewaySettings(data: {
    stripePublicKey?: string;
    stripeSecretKey?: string;
    paypalClientId?: string;
    paypalSecret?: string;
    activeGateways: string[];
}) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'No autorizado' };
        }

        const settings = await prisma.gatewaySettings.upsert({
            where: { userId: user.id },
            update: {
                stripePublicKey: data.stripePublicKey || null,
                stripeSecretKey: data.stripeSecretKey || null,
                paypalClientId: data.paypalClientId || null,
                paypalSecret: data.paypalSecret || null,
                activeGateways: data.activeGateways
            },
            create: {
                userId: user.id,
                stripePublicKey: data.stripePublicKey || null,
                stripeSecretKey: data.stripeSecretKey || null,
                paypalClientId: data.paypalClientId || null,
                paypalSecret: data.paypalSecret || null,
                activeGateways: data.activeGateways
            }
        });

        revalidatePath('/admin', 'layout');
        return { success: true, data: settings };
    } catch (error) {
        console.error('Error saving gateway settings:', error);
        return { success: false, error: 'Error al guardar configuración' };
    }
}
