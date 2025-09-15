import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/50 to-primary/5">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary text-primary-foreground border-primary">
                <Zap className="h-3 w-3 mr-1" />
                ¡Nueva experiencia gamer!
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="gamer-text-gradient">Level-Up</span>
                <br />
                <span className="text-foreground">Gamer Chile</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                ¡Explora, juega y gana con nosotros! La tienda gamer más completa de Chile con productos exclusivos,
                eventos épicos y un sistema de puntos que te recompensa por cada compra.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <Trophy className="h-5 w-5 text-primary" />
                <span>Sistema LevelUp</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-5 w-5 text-primary" />
                <span>Comunidad Gamer</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <span>Eventos Exclusivos</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalogo">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  Explorar Catálogo
                </Button>
              </Link>
              <Link href="/eventos">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Ver Eventos
                </Button>
              </Link>
            </div>

            {/* Student Discount Notice */}
            <div className="p-4 bg-primary text-primary-foreground border border-primary rounded-lg">
              <p className="text-sm">
                <strong className="text-primary-foreground">¡Estudiantes DUOC UC!</strong> Obtén descuentos especiales
                registrándote con tu correo @duoc.cl
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center level-up-shadow">
              <img src="/gaming.jpg" alt="Gaming Setup" className="w-full h-full object-fill rounded-2xl" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full level-up-shadow">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground p-3 rounded-full level-up-shadow">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
