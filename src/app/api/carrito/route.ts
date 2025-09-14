import { NextRequest, NextResponse } from "next/server";
import prisma from "../db";

export async function GET(req: NextRequest) {
    const usuarioId = req.nextUrl.searchParams.get('usuarioId');

    if (!usuarioId) {
    return NextResponse.json({ error: 'Falta usuarioId' }, { status: 400 });
    }

    const carrito = await prisma.carrito.findMany({
    where: { usuarioId },
    include: {
        producto: {
        include: { categoria: true }
        }
    }
    });

    return NextResponse.json(carrito);
}

export async function POST(req: NextRequest) {
    const { usuarioId, productoId, cantidad } = await req.json();

    if (!usuarioId || !productoId || !cantidad) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const existente = await prisma.carrito.findFirst({
    where: { usuarioId, productoId }
    });

    let nuevoItem;

    if (existente) {
    nuevoItem = await prisma.carrito.update({
        where: { id: existente.id },
        data: { cantidad: existente.cantidad + cantidad }
    });
    } else {
    nuevoItem = await prisma.carrito.create({
        data: {
        usuarioId,
        productoId,
        cantidad
        }
    });
    }

    return NextResponse.json(nuevoItem);
}

export async function DELETE(req: NextRequest) {
    const { carritoId } = await req.json();

    if (!carritoId) {
    return NextResponse.json({ error: 'Falta carritoId' }, { status: 400 });
    }

    await prisma.carrito.delete({
    where: { id: carritoId }
    });

    return NextResponse.json({ mensaje: 'Producto eliminado del carrito' });
}