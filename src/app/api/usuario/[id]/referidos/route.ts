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
    const referidos = await prisma.usuario.findMany({
      where: {
        referidoPorId: id
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        creadoEn: true,
        puntosLevelUp: true,
        nivel: true
      }
    });

    return NextResponse.json(referidos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener referidos' }, { status: 500 });
  }
}
