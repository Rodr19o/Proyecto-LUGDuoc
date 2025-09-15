"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Mail, Lock, User, Calendar, AlertCircle, Star } from "lucide-react"
import Navbar from "@/components/navbar"

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    edad: "",
    password: "",
    confirmPassword: "",
    referidoPorId: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isDuocEmail = formData.email.endsWith("@duoc.cl")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (Number.parseInt(formData.edad) < 18) {
      setError("Debes ser mayor de 18 años para registrarte")
      setIsLoading(false)
      return
    }

    try {
      const requestData = {
        nombre: formData.nombre,
        email: formData.email,
        edad: Number.parseInt(formData.edad),
        password: formData.password,
        ...(formData.referidoPorId && { referidoPorId: Number.parseInt(formData.referidoPorId) }),
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.usuario))
        router.push("/catalogo")
      } else {
        setError(data.error || "Error al registrarse")
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Gamepad2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Crear Cuenta</h1>
            <p className="text-muted-foreground">Únete a la comunidad Level-Up Gamer</p>
          </div>

          <Card className="gaming-card">
            <CardHeader>
              <CardTitle>Registro de Usuario</CardTitle>
              <CardDescription>Completa tus datos para comenzar a ganar puntos</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isDuocEmail && (
                  <Alert className="bg-primary/10 border-primary/20">
                    <Star className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-primary">
                      ¡Genial! Como estudiante DUOC UC tendrás descuentos especiales
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                  {isDuocEmail && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Descuento DUOC UC aplicable
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edad">Edad</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edad"
                      name="edad"
                      type="number"
                      placeholder="18"
                      min="18"
                      value={formData.edad}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referidoPorId">Código de Referido (Opcional)</Label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="referidoPorId"
                      name="referidoPorId"
                      type="number"
                      placeholder="ID del usuario que te refirió"
                      value={formData.referidoPorId}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gamer-gradient" disabled={isLoading}>
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
