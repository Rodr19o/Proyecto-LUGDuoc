import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"

type Params = {
    params: {
    productoId: string;
    };
};

export async function GET(_: NextRequest, { params }: Params) {
    const { productoId } = params;

    try {
    const reseñas = await prisma.reseña.findMany({
        where: { productoId },
        include: {
        usuario: {
            select: {
            nombre: true
            }
        }
        },
        orderBy: {
        creadoEn: 'desc'
        }
    });

    return NextResponse.json(reseñas);
    } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener reseñas' }, { status: 500 });
    }
}