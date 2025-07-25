import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { localStorageUtils } from '../utils/localStorage'
import type { AvailabilityData } from '../types/availability'
import { createDefaultAvailability } from '../types/availability'
import { textToJson } from '../function/textToJson/textToJson'
import interestedItems from '../spec/interested.json'

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
}

interface TherapistContextType {
  savedTherapists: TherapistData[]
  activeTherapist: TherapistData | null
  isCreatingNew: boolean
  notes: Record<string, string[]>
  saveTherapist: (therapistData: Omit<TherapistData, 'id' | 'createdAt'>) => void
  updateTherapist: (id: string, therapistData: Partial<Omit<TherapistData, 'id' | 'createdAt'>>) => void
  deleteTherapist: (id: string) => void
  clearAllTherapists: () => void
  selectTherapist: (id: string) => void
  createNewTherapist: () => void
  saveNote: (therapistId: string, note: string) => Promise<void>
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
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  // Load data from localStorage on initialization
  useEffect(() => {
    if (!localStorageUtils.isAvailable()) {
      console.warn('localStorage is not available')
      setIsInitialized(true)
      return
    }

    try {
      // Load therapists
      const loadedTherapists = localStorageUtils.loadTherapists()
      setSavedTherapists(loadedTherapists)

      // Load notes
      const loadedNotes = localStorageUtils.loadNotes()
      setNotes(loadedNotes)

      // Load creating new state
      const loadedIsCreatingNew = localStorageUtils.loadIsCreatingNew()
      setIsCreatingNew(loadedIsCreatingNew)

      // Load active therapist
      const activeTherapistId = localStorageUtils.loadActiveTherapistId()
      if (activeTherapistId && !loadedIsCreatingNew) {
        const activeTherapist = loadedTherapists.find(t => t.id === activeTherapistId)
        if (activeTherapist) {
          setActiveTherapist(activeTherapist)
        } else {
          // Clean up invalid active therapist ID
          localStorageUtils.saveActiveTherapistId(null)
          setIsCreatingNew(true)
        }
      }

      setIsInitialized(true)
    } catch (error) {
      console.error('Failed to load data from localStorage:', error)
      setIsInitialized(true)
    }
  }, [])

  const saveTherapist = (therapistData: Omit<TherapistData, 'id' | 'createdAt'>) => {
    const newTherapist: TherapistData = {
      ...therapistData,
      id: crypto.randomUUID(),
      availability: therapistData.availability || createDefaultAvailability(),
      createdAt: new Date().toISOString()
    }
    
    const updatedTherapists = [...savedTherapists, newTherapist]
    setSavedTherapists(updatedTherapists)
    setActiveTherapist(newTherapist)
    setIsCreatingNew(false)
    
    // Save to localStorage
    localStorageUtils.saveTherapists(updatedTherapists)
    localStorageUtils.saveActiveTherapistId(newTherapist.id)
    localStorageUtils.saveIsCreatingNew(false)
  }

  const updateTherapist = (id: string, therapistData: Partial<Omit<TherapistData, 'id' | 'createdAt'>>) => {
    const updatedTherapists = savedTherapists.map(therapist => 
      therapist.id === id 
        ? { ...therapist, ...therapistData }
        : therapist
    )
    setSavedTherapists(updatedTherapists)
    
    // Update active therapist if it's the one being updated
    let updatedActiveTherapist = activeTherapist
    if (activeTherapist?.id === id) {
      updatedActiveTherapist = { ...activeTherapist, ...therapistData }
      setActiveTherapist(updatedActiveTherapist)
    }
    
    // Save to localStorage
    localStorageUtils.saveTherapists(updatedTherapists)
  }

  const deleteTherapist = (id: string) => {
    const updatedTherapists = savedTherapists.filter(therapist => therapist.id !== id)
    setSavedTherapists(updatedTherapists)
    
    // Remove notes for this therapist
    const updatedNotes = { ...notes }
    delete updatedNotes[id]
    setNotes(updatedNotes)
    
    // If we're deleting the active therapist, switch to creating new
    if (activeTherapist?.id === id) {
      setActiveTherapist(null)
      setIsCreatingNew(true)
    }
    
    // Save to localStorage
    localStorageUtils.saveTherapists(updatedTherapists)
    localStorageUtils.saveNotes(updatedNotes)
    if (activeTherapist?.id === id) {
      localStorageUtils.saveActiveTherapistId(null)
      localStorageUtils.saveIsCreatingNew(true)
    }
  }

  const clearAllTherapists = () => {
    setSavedTherapists([])
    setActiveTherapist(null)
    setIsCreatingNew(true)
    setNotes({})
    
    // Clear localStorage
    localStorageUtils.clearAll()
  }

  const selectTherapist = (id: string) => {
    const therapist = savedTherapists.find(t => t.id === id)
    if (therapist) {
      setActiveTherapist(therapist)
      setIsCreatingNew(false)
      
      // Save to localStorage
      localStorageUtils.saveActiveTherapistId(id)
      localStorageUtils.saveIsCreatingNew(false)
    }
  }

  const createNewTherapist = () => {
    setActiveTherapist(null)
    setIsCreatingNew(true)
    
    // Save to localStorage
    localStorageUtils.saveActiveTherapistId(null)
    localStorageUtils.saveIsCreatingNew(true)
  }

  const saveNote = async (therapistId: string, note: string) => {
    const updatedNotes = {
      ...notes,
      [therapistId]: [...(notes[therapistId] || []), note]
    }
    setNotes(updatedNotes)
    
    // Save to localStorage
    localStorageUtils.saveNotes(updatedNotes)
    
    // Run textToJson function and console.log the result
    try {
      const OPENAI_API_KEY = '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';
      
      const interestedInfo = interestedItems;
      
      const result = await textToJson(note, interestedInfo, {
        apiKey: OPENAI_API_KEY,
        model: 'gpt-3.5-turbo',
        temperature: 0.3
      });
      
      console.log('TherapistNote textToJson result:', result);
    } catch (error) {
      console.error('Error running textToJson on TherapistNote:', error);
    }
  }

  const deleteNote = (therapistId: string, noteIndex: number) => {
    const updatedNotes = {
      ...notes,
      [therapistId]: (notes[therapistId] || []).filter((_, index) => index !== noteIndex)
    }
    setNotes(updatedNotes)
    
    // Save to localStorage
    localStorageUtils.saveNotes(updatedNotes)
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

  // Don't render children until data is loaded from localStorage
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>Loading therapist data...</div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Restoring from browser localStorage
        </div>
      </div>
    )
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