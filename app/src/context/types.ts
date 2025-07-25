import { createContext } from 'react'

export interface TherapistData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  licenses: string
  primaryConcerns: string[]
  specializations: string
  therapistStyles: string[]
  availability: string
  createdAt: string
  updatedAt: string
}

export interface TherapistContextType {
  savedTherapists: TherapistData[]
  activeTherapist: TherapistData | null
  isCreatingNew: boolean
  notes: Record<string, string[]>
  saveTherapist: (therapistData: Omit<TherapistData, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTherapist: (id: string, therapistData: Partial<Omit<TherapistData, 'id' | 'createdAt' | 'updatedAt'>>) => void
  deleteTherapist: (id: string) => void
  clearAllTherapists: () => void
  selectTherapist: (id: string) => void
  createNewTherapist: () => void
  saveNote: (therapistId: string, note: string) => Promise<void>
  deleteNote: (therapistId: string, noteIndex: number) => void
}

export const TherapistContext = createContext<TherapistContextType | undefined>(undefined)

// Form data type (excludes id, createdAt, updatedAt)
export type TherapistFormData = Omit<TherapistData, 'id' | 'createdAt' | 'updatedAt'>