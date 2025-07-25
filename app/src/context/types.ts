import { createContext } from 'react'
import type { AvailabilityData } from '../types/availability'

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
  availability: AvailabilityData
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
  saveNote: (therapistId: string, note: string) => void
  deleteNote: (therapistId: string, noteIndex: number) => void
}

export const TherapistContext = createContext<TherapistContextType | undefined>(undefined)