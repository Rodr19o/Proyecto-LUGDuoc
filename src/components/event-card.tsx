"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Trophy, Clock } from "lucide-react"

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

interface EventCardProps {
  event: Event
  onRegister?: (eventId: number) => void
  isRegistered?: boolean
}

export default function EventCard({ event, onRegister, isRegistered = false }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("es-CL", { month: "short" }),
      time: date.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      fullDate: date.toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }
  }

  const dateInfo = formatDate(event.fecha)
  const isEventFull = event.participantesActuales >= event.maxParticipantes
  const spotsLeft = event.maxParticipantes - event.participantesActuales
  const isPastEvent = new Date(event.fecha) < new Date()

  return (
    <Card className="gaming-card h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          {/* Date Badge */}
          <div className="bg-primary/10 rounded-lg p-3 text-center min-w-[60px]">
            <div className="text-2xl font-bold text-primary">{dateInfo.day}</div>
            <div className="text-xs text-primary uppercase">{dateInfo.month}</div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-col gap-2">
            {isPastEvent && (
              <Badge variant="secondary" className="bg-muted">
                Finalizado
              </Badge>
            )}
            {isEventFull && !isPastEvent && <Badge variant="destructive">Completo</Badge>}
            {isRegistered && (
              <Badge variant="default" className="bg-green-600">
                Registrado
              </Badge>
            )}
            {event.puntosRecompensa > 0 && (
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                <Trophy className="h-3 w-3 mr-1" />
                {event.puntosRecompensa} pts
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="text-xl line-clamp-2 mt-4">{event.nombre}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Event Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{dateInfo.fullDate}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{dateInfo.time} hrs</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.ubicacion}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {event.participantesActuales} / {event.maxParticipantes} participantes
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{event.descripcion}</p>

          {/* Spots Warning */}
          {!isPastEvent && !isEventFull && spotsLeft <= 5 && (
            <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
              ¡Solo quedan {spotsLeft} cupos disponibles!
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {isPastEvent ? (
            <Button variant="outline" className="w-full bg-transparent" disabled>
              Evento Finalizado
            </Button>
          ) : isRegistered ? (
            <Button variant="outline" className="w-full bg-transparent" disabled>
              Ya Registrado
            </Button>
          ) : isEventFull ? (
            <Button variant="outline" className="w-full bg-transparent" disabled>
              Evento Completo
            </Button>
          ) : (
            <Button onClick={() => onRegister?.(event.id)} className="w-full gamer-gradient">
              Registrarse
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
