import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: NextRequest, { params }: Params) {
  const { id: usuarioId } = params;

  try {
    const ordenes = await prisma.orden.findMany({
      where: { usuarioId },
      include: {
        detalles: {
          include: {
            producto: {
              select: {
                nombre: true,
                imagenUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        creadoEn: 'desc'
      }
    });

    return NextResponse.json(ordenes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener órdenes del usuario' }, { status: 500 });
  }
}
