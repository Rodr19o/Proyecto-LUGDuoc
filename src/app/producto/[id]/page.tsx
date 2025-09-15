"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingCart, Plus, Minus, Heart, Share2 } from "lucide-react"
import { getStoredUser } from "@/lib/auth"

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

interface Review {
  id: number
  usuarioId: number
  productoId: number
  calificacion: number
  comentario: string
  fechaCreacion: string
  usuario: {
    nombre: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [newReview, setNewReview] = useState({
    calificacion: 5,
    comentario: "",
  })
  const [canReview, setCanReview] = useState(false)

  const user = getStoredUser()

  useEffect(() => {
    if (productId) {
      fetchProduct()
      fetchReviews()
      checkCanReview()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/productos/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reseña/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  const checkCanReview = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/usuario/${user.id}/ordenes`)
      if (response.ok) {
        const orders = await response.json()
        const hasPurchased = orders.some((order: any) => order.items.some((item: any) => item.productoId === productId))
        setCanReview(hasPurchased)
      }
    } catch (error) {
      console.error("Error checking purchase history:", error)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito")
      return
    }

    try {
      const response = await fetch("/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: user.id,
          productoId: productId,
          cantidad: quantity,
        }),
      })

      if (response.ok) {
        alert("Producto agregado al carrito")
      } else {
        alert("Error al agregar producto al carrito")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Error al agregar producto al carrito")
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const response = await fetch("/api/reseña", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: user.id,
          productoId: productId,
          calificacion: newReview.calificacion,
          comentario: newReview.comentario,
        }),
      })

      if (response.ok) {
        alert("Reseña enviada exitosamente")
        setNewReview({ calificacion: 5, comentario: "" })
        fetchReviews()
      } else {
        alert("Error al enviar reseña")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Error al enviar reseña")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price)
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.calificacion, 0) / reviews.length : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando producto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
            <p className="text-muted-foreground">El producto que buscas no existe o no está disponible.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={
                  product.imagen || `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.nombre)}`
                }
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.categoria}
              </Badge>
              <h1 className="text-3xl font-bold mb-4">{product.nombre}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= averageRating ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({reviews.length} reseñas)</span>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">{product.descripcion}</p>
            </div>

            {/* Price and Stock */}
            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">{formatPrice(product.precio)}</div>

              <div className="flex items-center space-x-2">
                {product.stock > 0 ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    En stock ({product.stock} disponibles)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Agotado</Badge>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="quantity">Cantidad:</Label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleAddToCart} className="flex-1 gamer-gradient" size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al Carrito
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Reviews Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Reseñas de Clientes</h2>

          {/* Add Review Form */}
          {canReview && user && (
            <Card>
              <CardHeader>
                <CardTitle>Escribir una Reseña</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Calificación</Label>
                    <div className="flex space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, calificacion: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= newReview.calificacion ? "fill-primary text-primary" : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comentario</Label>
                    <Textarea
                      id="comment"
                      placeholder="Comparte tu experiencia con este producto..."
                      value={newReview.comentario}
                      onChange={(e) => setNewReview({ ...newReview, comentario: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="gamer-gradient">
                    Enviar Reseña
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">{review.usuario.nombre}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.calificacion ? "fill-primary text-primary" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.fechaCreacion).toLocaleDateString("es-CL")}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground">{review.comentario}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Aún no hay reseñas para este producto.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
