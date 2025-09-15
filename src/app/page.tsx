import Navbar from "@/components/navbar"
import HeroBanner from "@/components/hero-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Trophy, Users, Calendar, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              ¿Por qué elegir <span className="gamer-text-gradient">Level-Up Gamer</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Somos más que una tienda, somos tu comunidad gamer en Chile
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="gaming-card text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Sistema LevelUp</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gana puntos con cada compra y sube de nivel para obtener descuentos exclusivos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="gaming-card text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Comunidad Activa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Conecta con otros gamers, comparte reseñas y participa en eventos exclusivos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="gaming-card text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Eventos Gamer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Torneos, lanzamientos y meetups exclusivos para la comunidad chilena</CardDescription>
              </CardContent>
            </Card>

            <Card className="gaming-card text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Descuentos DUOC</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Estudiantes de DUOC UC obtienen descuentos especiales en toda la tienda
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="gaming-card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Listo para subir de nivel?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Únete a la comunidad gamer más grande de Chile. Explora nuestro catálogo, participa en eventos y
                comienza a ganar puntos LevelUp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/catalogo">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Ver Catálogo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button variant="outline" size="lg">
                    Crear Cuenta
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="font-bold gamer-text-gradient">Level-Up Gamer Chile</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Level-Up Gamer. La comunidad gamer de Chile.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
