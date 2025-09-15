import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"


type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = params;

  try {
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: true,
        reseñas: {
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
        }
      }
    });

    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}
