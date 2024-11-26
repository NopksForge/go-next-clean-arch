export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  updatedAt: string
  isActive: boolean
}

export interface ApiUser {
  userId: string
  userEmail: string
  userFirstName: string
  userLastName: string
  userPhone: string
  userRole: string
  userUpdatedAt: string
  isActive: boolean
}

export interface ApiResponse {
  code: number
  message: string
  data: ApiUser[]
} 