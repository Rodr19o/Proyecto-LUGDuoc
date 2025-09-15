export interface User {
  id: number
  nombre: string
  email: string
  edad: number
  puntosLevelUp: number
  nivel: number
  fechaRegistro: string
  referidoPorId?: number
}

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

export const setStoredUser = (user: User) => {
  if (typeof window === "undefined") return

  localStorage.setItem("user", JSON.stringify(user))
}

export const removeStoredUser = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem("user")
}

export const isAuthenticated = (): boolean => {
  return getStoredUser() !== null
}

export const requireAuth = () => {
  const user = getStoredUser()
  if (!user) {
    throw new Error("Usuario no autenticado")
  }
  return user
}
