import { NextRequest, NextResponse } from "next/server";
import prisma from "../../db"
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const userData = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    nivel: usuario.nivel,
    puntosLevelUp: usuario.puntosLevelUp
    };

    return NextResponse.json(userData);

}

