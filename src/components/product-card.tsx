"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  categoria: string
  stock: number
  activo: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: number) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price)
  }

  return (
    <Card className="gaming-card h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <img
            src={product.imagen || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.nombre)}`}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              ¡Últimas {product.stock}!
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-muted">
              Agotado
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {product.categoria}
          </Badge>

          <Link href={`/producto/${product.id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
              {product.nombre}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2">{product.descripcion}</p>

          <div className="flex items-center space-x-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(4.5)</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{formatPrice(product.precio)}</span>
          </div>

          <div className="flex gap-2">
            <Link href={`/producto/${product.id}`} className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Ver Detalles
              </Button>
            </Link>

            {product.stock > 0 && onAddToCart && (
              <Button onClick={() => onAddToCart(product.id)} className="gamer-gradient" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
