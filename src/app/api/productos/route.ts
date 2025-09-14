import { NextResponse } from "next/server";
import  prisma  from "../db";

export async function GET() {
    try {
        const productos = await prisma.producto.findMany({
            where: { activo: true },
            include: { categoria: true, reseñas: true },
        });
        return NextResponse.json(productos);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
    }
}
