import { NextRequest, NextResponse } from "next/server";
import prisma from "../db";

export async function POST(req: NextRequest) {
    try {
    const { usuarioId } = await req.json();

    if (!usuarioId) {
        return NextResponse.json({ error: 'Falta usuarioId' }, { status: 400 });
    }
    const carrito = await prisma.carrito.findMany({
        where: { usuarioId },
        include: { producto: true }

    });

    if (carrito.length === 0) {
        return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }
    const total = carrito.reduce ((acc: number , item: typeof carrito[0]) => {
        
      return acc + item.producto.precio * item.cantidad;
    }, 0)

    type CarritoConProducto = {
    productoId: string;
    producto: {
    precio: number;
    };
    cantidad: number;
};

    const detallesData = carrito.map((item: CarritoConProducto) => ({
    productoId: item.productoId,
    cantidad: item.cantidad,
    precioUnit: item.producto.precio
}));

    const orden = await prisma.orden.create({
        data: {
        usuarioId,
        total,
        estado: 'pendiente',
        detalles: detallesData 
        },
        include: { detalles: true }
    });
    await prisma.carrito.deleteMany({ where: { usuarioId } });

    return NextResponse.json(orden);
    
} catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al generar la orden' }, { status: 500 });
    }
}

