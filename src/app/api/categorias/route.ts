import { NextRequest, NextResponse } from 'next/server';
import prisma from "../db";

export async function GET(_: NextRequest) {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  }
}
