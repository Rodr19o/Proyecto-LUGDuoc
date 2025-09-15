import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"

export async function GET(_: NextRequest) {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: {
        fecha: 'asc'
      }
    });

    return NextResponse.json(eventos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
  }
}
