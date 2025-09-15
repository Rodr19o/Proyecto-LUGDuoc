"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { User, Star, Trophy, Calendar, ShoppingBag, Users, Mail, Gift, TrendingUp } from "lucide-react"
import { getStoredUser } from "@/lib/auth"

interface UserProfile {
  id: number
  nombre: string
  email: string
  edad: number
  puntosLevelUp: number
  nivel: number
  fechaRegistro: string
  referidoPorId?: number
}

interface Order {
  id: number
  usuarioId: number
  total: number
  estado: string
  fechaCreacion: string
  items: Array<{
    id: number
    productoId: number
    cantidad: number
    precio: number
    producto: {
      nombre: string
      imagen: string
    }
  }>
}

interface Referral {
  id: number
  nombre: string
  email: string
  fechaRegistro: string
  puntosLevelUp: number
}

export default function PerfilPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const user = getStoredUser()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchUserProfile()
    fetchOrders()
    fetchReferrals()
  }, [user, router])

  const fetchUserProfile = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/usuario/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const fetchOrders = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/usuario/${user.id}/ordenes`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const fetchReferrals = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/usuario/${user.id}/referidos`)
      if (response.ok) {
        const data = await response.json()
        setReferrals(data)
      }
    } catch (error) {
      console.error("Error fetching referrals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getNextLevelPoints = (currentLevel: number) => {
    return currentLevel * 1000 // Each level requires 1000 more points
  }

  const getLevelProgress = (points: number, level: number) => {
    const currentLevelPoints = (level - 1) * 1000
    const nextLevelPoints = level * 1000
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    return Math.max(0, Math.min(100, progress))
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  const profile = userProfile || user
  const nextLevelPoints = getNextLevelPoints(profile.nivel)
  const levelProgress = getLevelProgress(profile.puntosLevelUp, profile.nivel)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="gaming-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{profile.nombre}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>Miembro desde {formatDate(profile.fechaRegistro)}</span>
                    </div>
                  </div>

                  {/* Level and Points */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <Trophy className="h-3 w-3 mr-1" />
                        Nivel {profile.nivel}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{profile.puntosLevelUp} puntos LevelUp</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progreso al siguiente nivel</span>
                        <span>{nextLevelPoints - profile.puntosLevelUp} puntos restantes</span>
                      </div>
                      <Progress value={levelProgress} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">{orders.length}</div>
                    <div className="text-xs text-muted-foreground">Órdenes</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">{referrals.length}</div>
                    <div className="text-xs text-muted-foreground">Referidos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Mis Órdenes
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Referidos
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Recompensas
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Compras</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="gaming-card">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold">Orden #{order.id}</h4>
                              <p className="text-sm text-muted-foreground">{formatDate(order.fechaCreacion)}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">{formatPrice(order.total)}</div>
                              <Badge variant={order.estado === "completada" ? "default" : "secondary"}>
                                {order.estado}
                              </Badge>
                            </div>
                          </div>

                          <Separator className="my-3" />

                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                                  <img
                                    src={
                                      item.producto.imagen ||
                                      `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(item.producto.nombre)}`
                                    }
                                    alt={item.producto.nombre}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.producto.nombre}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Cantidad: {item.cantidad} × {formatPrice(item.precio)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No tienes órdenes aún</h3>
                    <p className="text-muted-foreground">¡Explora nuestro catálogo y haz tu primera compra!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Programa de Referidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Referral Code */}
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Tu Código de Referido</h4>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-3 py-1 rounded border text-primary font-mono">
                        {profile.id}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(profile.id.toString())}
                      >
                        Copiar
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Comparte tu código con amigos y gana puntos cuando se registren
                    </p>
                  </div>

                  {/* Referrals List */}
                  {referrals.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Usuarios Referidos ({referrals.length})</h4>
                      {referrals.map((referral) => (
                        <Card key={referral.id} className="gaming-card">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{referral.nombre}</p>
                                <p className="text-sm text-muted-foreground">
                                  Se unió el {formatDate(referral.fechaRegistro)}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                  <Star className="h-3 w-3 mr-1" />
                                  {referral.puntosLevelUp} pts
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No tienes referidos aún</h3>
                      <p className="text-muted-foreground">
                        Invita a tus amigos y gana puntos LevelUp por cada registro
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sistema de Recompensas LevelUp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Status */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="gaming-card bg-primary/5 border-primary/20">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h4 className="font-semibold text-primary">Puntos Actuales</h4>
                        <p className="text-2xl font-bold">{profile.puntosLevelUp}</p>
                      </CardContent>
                    </Card>

                    <Card className="gaming-card bg-accent/5 border-accent/20">
                      <CardContent className="p-4 text-center">
                        <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                        <h4 className="font-semibold text-accent">Nivel Actual</h4>
                        <p className="text-2xl font-bold">{profile.nivel}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* How it works */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">¿Cómo funciona?</h4>
                    <div className="grid gap-4">
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Compras</p>
                          <p className="text-sm text-muted-foreground">Gana 1 punto por cada $1.000 gastados</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Users className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Referidos</p>
                          <p className="text-sm text-muted-foreground">
                            Gana 500 puntos por cada amigo que se registre
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Star className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Reseñas</p>
                          <p className="text-sm text-muted-foreground">Gana 100 puntos por cada reseña que escribas</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits by Level */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Beneficios por Nivel</h4>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`p-3 rounded-lg border ${
                            profile.nivel >= level ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={profile.nivel >= level ? "default" : "secondary"}
                                className={profile.nivel >= level ? "bg-primary" : ""}
                              >
                                Nivel {level}
                              </Badge>
                              <span className="text-sm">{level}% de descuento en toda la tienda</span>
                            </div>
                            {profile.nivel >= level && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Desbloqueado
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
