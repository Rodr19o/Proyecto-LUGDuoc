"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Calendar, Gamepad2, Menu, X, LogOut, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserInterface {
  id: number
  nombre: string
  email: string
  puntosLevelUp: number
  nivel: number
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserInterface | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchCartCount(parsedUser.id)
    }
  }, [])

  const fetchCartCount = async (userId: number) => {
    try {
      const response = await fetch(`/api/carrito?usuarioId=${userId}`)
      if (response.ok) {
        const cart = await response.json()
        const totalItems = cart.reduce((sum: number, item: any) => sum + item.cantidad, 0)
        setCartCount(totalItems)
      }
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setCartCount(0)
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold gamer-text-gradient">Level-Up Gamer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/catalogo" className="text-foreground hover:text-primary transition-colors">
              Catálogo
            </Link>
            <Link href="/eventos" className="text-foreground hover:text-primary transition-colors">
              Eventos
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Level Badge */}
                <div className="hidden sm:flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Nivel {user.nivel}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{user.puntosLevelUp} pts</span>
                </div>

                {/* Cart */}
                <Link href="/carrito">
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Profile */}
                <Link href="/perfil">
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Logout */}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link
                href="/catalogo"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link
                href="/eventos"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos
              </Link>
              {user && (
                <div className="flex items-center space-x-2 py-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Nivel {user.nivel}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{user.puntosLevelUp} pts</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
