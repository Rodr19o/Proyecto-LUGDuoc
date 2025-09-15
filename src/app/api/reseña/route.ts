import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    const { usuarioId, productoId, calificacion, comentario } = await req.json();

    if (!usuarioId || !productoId || !calificacion || !comentario) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    if (calificacion < 1 || calificacion > 5) {
    return NextResponse.json({ error: 'La calificación debe estar entre 1 y 5' }, { status: 400 });
    }

    try {
    const nuevaReseña = await prisma.reseña.create({
        data: {
        usuarioId,
        productoId,
        calificacion,
        comentario
        }
    });

    return NextResponse.json(nuevaReseña);
    } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear reseña' }, { status: 500 });
    }
}