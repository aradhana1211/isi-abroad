export type AdvisorInputs = {
  name: string
  email: string
  phoneNumber: string
  password: string
  photoId: string
}

export interface User {
  id: number
  email: string
}

export interface AdvisorData {
  id: number
  name: string
  photoLink: string
  phoneNumber: string
  createdAt: string
  updatedAt: string | null
  userId: number
  user: User
  studentsCount: number | null
}
