import { NextRequest, NextResponse } from "next/server";
import prisma from "../../db"
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { nombre, email, password, edad, referidoPorId } = body;

    if (edad < 18) {
        return NextResponse.json({ error: "Debes ser mayor de 18 años para registrarte." }, { status: 400 });
    }

    const existeUsuario = await prisma.usuario.findUnique({
        where: { email }
    });
    if (existeUsuario) {
        return NextResponse.json({ error: "El correo electrónico ya está en uso." }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const esDuoc = email.endsWith("@duocuc.cl") || email.endsWith("@duoc.cl");
    const nuevoUsuario = await prisma.usuario.create({
        data: {
            nombre,
            email,
            password: hashedPassword,
            edad,
            esDuoc,
            descuentoDuoc: esDuoc,
            referidoPorId,
        }
    })
    return NextResponse.json(nuevoUsuario);
    
}