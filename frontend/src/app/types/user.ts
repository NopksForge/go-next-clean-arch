export interface User {
  id: string
  name: string
  email: string
}

export interface ApiUser {
  userId: string
  userName: string
  userEmail: string
}

export interface ApiResponse {
  code: number
  message: string
  data: ApiUser[]
} 