'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getDiscountCodes() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') return { success: false, error: 'No autorizado' };

        const codes = await prisma.discountCode.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: codes };
    } catch (error) {
        console.error('Error fetching discount codes:', error);
        return { success: false, error: 'Error al cargar los códigos de descuento' };
    }
}

export async function createDiscountCode(data: { code: string; discount: number }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') return { success: false, error: 'No autorizado' };

        const existing = await prisma.discountCode.findUnique({
            where: { code: data.code }
        });

        if (existing) {
            return { success: false, error: 'El código ya existe' };
        }

        const newCode = await prisma.discountCode.create({
            data: {
                code: data.code,
                discount: data.discount
            }
        });
        return { success: true, data: newCode };
    } catch (error) {
        console.error('Error creating discount code:', error);
        return { success: false, error: 'Error al crear el código' };
    }
}

export async function deleteDiscountCode(id: number) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') return { success: false, error: 'No autorizado' };

        await prisma.discountCode.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error('Error deleting discount code:', error);
        return { success: false, error: 'Error al eliminar el código' };
    }
}

export async function validateDiscountCode(code: string) {
    try {
        const discountCode = await prisma.discountCode.findUnique({
            where: { code }
        });

        if (!discountCode) {
            return { success: false, error: 'Código inválido' };
        }

        if (discountCode.used) {
            return { success: false, error: 'El código ya ha sido utilizado' };
        }

        return { success: true, data: { id: discountCode.id, code: discountCode.code, discount: discountCode.discount } };
    } catch (error) {
        console.error('Error validating discount code:', error);
        return { success: false, error: 'Error al validar el código' };
    }
}
