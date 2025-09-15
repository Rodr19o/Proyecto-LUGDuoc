
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

type Params = {
    params: {
    id: string;
    };
};

export async function GET(_: NextRequest, { params }: Params) {
    const { id } = params;

    try {
    const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: {
        id: true,
        nombre: true,
        email: true,
        edad: true,
        esDuoc: true,
        descuentoDuoc: true,
        puntosLevelUp: true,
        nivel: true,
        creadoEn: true,
        referidoPorId: true
        }
    });

    if (!usuario) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(usuario);
    } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 });
    }
}