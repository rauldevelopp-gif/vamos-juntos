'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getDiscountCodes() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'No autorizado' };

        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

        const codes = await prisma.discountCode.findMany({
            where: whereClause,
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
        if (!user) return { success: false, error: 'No autorizado' };

        const existing = await prisma.discountCode.findUnique({
            where: { code: data.code }
        });

        if (existing) {
            return { success: false, error: 'El código ya existe' };
        }

        const newCode = await prisma.discountCode.create({
            data: {
                code: data.code,
                discount: data.discount,
                userId: user.id
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
        if (!user) return { success: false, error: 'No autorizado' };

        const existing = await prisma.discountCode.findUnique({ where: { id } });
        if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
            return { success: false, error: 'No autorizado' };
        }

        await prisma.discountCode.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error('Error deleting discount code:', error);
        return { success: false, error: 'Error al eliminar el código' };
    }
}

export async function validateDiscountCode(code: string, packageId: number) {
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

        // Fetch package to verify ownership
        const pkg = await prisma.package.findUnique({ where: { id: packageId } });
        if (!pkg) {
            return { success: false, error: 'Paquete no encontrado' };
        }

        if (discountCode.userId !== pkg.userId) {
            return { success: false, error: 'Este código de descuento no es válido para este paquete' };
        }

        return { success: true, data: { id: discountCode.id, code: discountCode.code, discount: discountCode.discount } };
    } catch (error) {
        console.error('Error validating discount code:', error);
        return { success: false, error: 'Error al validar el código' };
    }
}
