"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import EventCard from "@/components/event-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trophy, Users, Filter, Clock } from "lucide-react"
import { getStoredUser } from "@/lib/auth"

interface Event {
  id: number
  nombre: string
  descripcion: string
  fecha: string
  ubicacion: string
  puntosRecompensa: number
  maxParticipantes: number
  participantesActuales: number
  activo: boolean
}

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming")
  const [sortBy, setSortBy] = useState<"date" | "points">("date")
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])

  const user = getStoredUser()

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterAndSortEvents()
  }, [events, filter, sortBy])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/eventos")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortEvents = () => {
    const now = new Date()
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.fecha)

      switch (filter) {
        case "upcoming":
          return eventDate >= now && event.activo
        case "past":
          return eventDate < now
        case "all":
        default:
          return event.activo
      }
    })

    // Sort events
    filtered.sort((a, b) => {
      if (sortBy === "points") {
        return b.puntosRecompensa - a.puntosRecompensa
      }
      // Default: sort by date
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    })

    setFilteredEvents(filtered)
  }

  const handleRegister = async (eventId: number) => {
    if (!user) {
      alert("Debes iniciar sesión para registrarte en eventos")
      return
    }

    // Since there's no registration endpoint in the provided API,
    // we'll simulate the registration
    try {
      // This would be the actual API call:
      // const response = await fetch('/api/eventos/registro', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ usuarioId: user.id, eventoId: eventId })
      // })

      // For now, we'll just add to local state
      setRegisteredEvents((prev) => [...prev, eventId])
      alert("¡Te has registrado exitosamente al evento!")

      // Update participant count locally
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, participantesActuales: event.participantesActuales + 1 } : event,
        ),
      )
    } catch (error) {
      console.error("Error registering for event:", error)
      alert("Error al registrarse en el evento")
    }
  }

  const upcomingEvents = events.filter((event) => new Date(event.fecha) >= new Date() && event.activo)
  const totalPoints = upcomingEvents.reduce((sum, event) => sum + event.puntosRecompensa, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando eventos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gamer-text-gradient">Eventos</span> Gamer Chile
          </h1>
          <p className="text-muted-foreground">Únete a la comunidad gamer más activa de Chile</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="gaming-card">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              <div className="text-sm text-muted-foreground">Eventos Próximos</div>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Puntos Disponibles</div>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {upcomingEvents.reduce((sum, event) => sum + event.participantesActuales, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Gamers Registrados</div>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">Santiago</div>
              <div className="text-sm text-muted-foreground">Ciudad Principal</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter Badges */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={filter === "upcoming" ? "default" : "outline"}
                  className={`cursor-pointer ${filter === "upcoming" ? "bg-primary" : ""}`}
                  onClick={() => setFilter("upcoming")}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Próximos
                </Badge>
                <Badge
                  variant={filter === "all" ? "default" : "outline"}
                  className={`cursor-pointer ${filter === "all" ? "bg-primary" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  Todos
                </Badge>
                <Badge
                  variant={filter === "past" ? "default" : "outline"}
                  className={`cursor-pointer ${filter === "past" ? "bg-primary" : ""}`}
                  onClick={() => setFilter("past")}
                >
                  Pasados
                </Badge>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value: "date" | "points") => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="points">Puntos de Recompensa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
                isRegistered={registeredEvents.includes(event.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {filter === "upcoming"
                  ? "No hay eventos próximos"
                  : filter === "past"
                    ? "No hay eventos pasados"
                    : "No hay eventos disponibles"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {filter === "upcoming"
                  ? "Mantente atento, pronto habrá nuevos eventos emocionantes"
                  : "Cambia el filtro para ver otros eventos"}
              </p>
              {filter !== "upcoming" && (
                <Button onClick={() => setFilter("upcoming")} className="gamer-gradient">
                  Ver Eventos Próximos
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        {user && upcomingEvents.length > 0 && (
          <Card className="mt-12 gaming-card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">¡Participa y Gana Puntos LevelUp!</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Cada evento te da la oportunidad de ganar puntos LevelUp, conocer otros gamers y vivir experiencias
                únicas. ¡No te pierdas la diversión!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span>Hasta {Math.max(...upcomingEvents.map((e) => e.puntosRecompensa))} puntos por evento</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Comunidad activa de gamers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Eventos en toda la región</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
