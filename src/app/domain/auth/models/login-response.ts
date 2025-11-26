export type LoginResponse = {
  user: {
    id: string
    name: string
    isAdmin: boolean
  },
  expiresIn: number
}
