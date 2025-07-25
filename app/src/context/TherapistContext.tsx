import { createContext, useContext, useState, type ReactNode } from 'react'

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
  notes: Record<string, string[]>
  saveTherapist: (therapistData: Omit<TherapistData, 'id' | 'createdAt'>) => void
  updateTherapist: (id: string, therapistData: Omit<TherapistData, 'id' | 'createdAt'>) => void
  deleteTherapist: (id: string) => void
  clearAllTherapists: () => void
  selectTherapist: (id: string) => void
  createNewTherapist: () => void
  saveNote: (therapistId: string, note: string) => void
  deleteNote: (therapistId: string, noteIndex: number) => void
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined)

interface TherapistProviderProps {
  children: ReactNode
}

export const TherapistProvider = ({ children }: TherapistProviderProps) => {
  const [savedTherapists, setSavedTherapists] = useState<TherapistData[]>([])
  const [activeTherapist, setActiveTherapist] = useState<TherapistData | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(true)
  const [notes, setNotes] = useState<Record<string, string[]>>({})

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
    
    // Remove notes for this therapist
    setNotes(prev => {
      const newNotes = { ...prev }
      delete newNotes[id]
      return newNotes
    })
    
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
    setNotes({})
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

  const saveNote = (therapistId: string, note: string) => {
    setNotes(prev => ({
      ...prev,
      [therapistId]: [...(prev[therapistId] || []), note]
    }))
  }

  const deleteNote = (therapistId: string, noteIndex: number) => {
    setNotes(prev => ({
      ...prev,
      [therapistId]: (prev[therapistId] || []).filter((_, index) => index !== noteIndex)
    }))
  }

  const value: TherapistContextType = {
    savedTherapists,
    activeTherapist,
    isCreatingNew,
    notes,
    saveTherapist,
    updateTherapist,
    deleteTherapist,
    clearAllTherapists,
    selectTherapist,
    createNewTherapist,
    saveNote,
    deleteNote
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