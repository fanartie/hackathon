import { createContext, useContext, useState, ReactNode } from 'react'

export interface TherapistData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  licenses: string
  primaryConcerns: string
  specializations: string
  createdAt: string
}

interface TherapistContextType {
  savedTherapists: TherapistData[]
  activeTherapist: TherapistData | null
  isCreatingNew: boolean
  saveTherapist: (therapistData: Omit<TherapistData, 'id' | 'createdAt'>) => void
  updateTherapist: (id: string, therapistData: Omit<TherapistData, 'id' | 'createdAt'>) => void
  deleteTherapist: (id: string) => void
  clearAllTherapists: () => void
  selectTherapist: (id: string) => void
  createNewTherapist: () => void
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined)

interface TherapistProviderProps {
  children: ReactNode
}

export const TherapistProvider = ({ children }: TherapistProviderProps) => {
  const [savedTherapists, setSavedTherapists] = useState<TherapistData[]>([])
  const [activeTherapist, setActiveTherapist] = useState<TherapistData | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(true)

  const saveTherapist = (therapistData: Omit<TherapistData, 'id' | 'createdAt'>) => {
    const newTherapist: TherapistData = {
      ...therapistData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }
    
    setSavedTherapists(prev => [...prev, newTherapist])
    setActiveTherapist(newTherapist)
    setIsCreatingNew(false)
  }

  const updateTherapist = (id: string, therapistData: Omit<TherapistData, 'id' | 'createdAt'>) => {
    setSavedTherapists(prev => 
      prev.map(therapist => 
        therapist.id === id 
          ? { ...therapist, ...therapistData }
          : therapist
      )
    )
    
    // Update active therapist if it's the one being updated
    if (activeTherapist?.id === id) {
      setActiveTherapist(prev => prev ? { ...prev, ...therapistData } : null)
    }
  }

  const deleteTherapist = (id: string) => {
    setSavedTherapists(prev => prev.filter(therapist => therapist.id !== id))
    
    // If we're deleting the active therapist, switch to creating new
    if (activeTherapist?.id === id) {
      setActiveTherapist(null)
      setIsCreatingNew(true)
    }
  }

  const clearAllTherapists = () => {
    setSavedTherapists([])
    setActiveTherapist(null)
    setIsCreatingNew(true)
  }

  const selectTherapist = (id: string) => {
    const therapist = savedTherapists.find(t => t.id === id)
    if (therapist) {
      setActiveTherapist(therapist)
      setIsCreatingNew(false)
    }
  }

  const createNewTherapist = () => {
    setActiveTherapist(null)
    setIsCreatingNew(true)
  }

  const value: TherapistContextType = {
    savedTherapists,
    activeTherapist,
    isCreatingNew,
    saveTherapist,
    updateTherapist,
    deleteTherapist,
    clearAllTherapists,
    selectTherapist,
    createNewTherapist
  }

  return (
    <TherapistContext.Provider value={value}>
      {children}
    </TherapistContext.Provider>
  )
}

export const useTherapist = () => {
  const context = useContext(TherapistContext)
  if (context === undefined) {
    throw new Error('useTherapist must be used within a TherapistProvider')
  }
  return context
}