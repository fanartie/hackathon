/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type ReactNode } from 'react'
import { localStorageUtils } from '../utils/localStorage'
import { TherapistContext, type TherapistContextType, type TherapistData } from './types'
import { textToJson } from '../function/textToJson/textToJson'

interface TherapistProviderProps {
  children: ReactNode
}

export const TherapistProvider = ({ children }: TherapistProviderProps) => {
  const [savedTherapists, setSavedTherapists] = useState<any>([])
  const [activeTherapist, setActiveTherapist] = useState<any>(null)
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
      // Load therapists and migrate any missing fields
      const loadedTherapists = localStorageUtils.loadTherapists().map(therapist => ({
        ...therapist,
        availability: therapist.availability || '',
        therapistStyles: therapist.therapistStyles || [],
        updatedAt: therapist.updatedAt || therapist.createdAt
      }))
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

  const saveTherapist = (therapistData: Omit<TherapistData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newTherapist: TherapistData = {
      ...therapistData,
      id: crypto.randomUUID(),
      availability: therapistData.availability || '',
      createdAt: now,
      updatedAt: now
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

  const updateTherapist = (id: string, therapistData: Partial<Omit<TherapistData, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updatedTherapists = savedTherapists.map(therapist => 
      therapist.id === id 
        ? { ...therapist, ...therapistData, updatedAt: new Date().toISOString() }
        : therapist
    )
    setSavedTherapists(updatedTherapists)
    
    // Update active therapist if it's the one being updated
    if (activeTherapist?.id === id) {
      const updatedActiveTherapist = { ...activeTherapist, ...therapistData, updatedAt: new Date().toISOString() }
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
    
    // Run textToJson function and update therapist data
    try {
      const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
      
      // Get existing therapist data to pass as context
      const currentTherapist = savedTherapists.find(t => t.id === therapistId);
      const existingData = currentTherapist ? {
        personalInfo: {
          firstName: currentTherapist.firstName,
          lastName: currentTherapist.lastName,
          email: currentTherapist.email,
          phone: currentTherapist.phone,
          address: currentTherapist.address
        },
        professionalInfo: {
          licenses: currentTherapist.licenses,
          specializations: currentTherapist.specializations,
          primaryConcerns: currentTherapist.primaryConcerns
        },
        styleAndApproach: {
          therapistStyles: currentTherapist.therapistStyles
        },
        availability: currentTherapist.availability
      } : undefined;

      const result = await textToJson(note, {
        apiKey: OPENAI_API_KEY,
        model: 'gpt-3.5-turbo',
        temperature: 0.3,
        useSchema: true
      }, existingData);
      
      console.log('TherapistNote textToJson result:', result);
      
      // Update therapist data if parsing was successful and we have a valid therapist
      if (result.success && result.data && therapistId) {
        const parsedData = result.data as any;
        
        // Build update object from parsed schema data
        const updateData: any = {};
        
        // Extract personal info (delta updates)
        if (parsedData.personalInfo) {
          if (parsedData.personalInfo.firstName) updateData.firstName = parsedData.personalInfo.firstName;
          if (parsedData.personalInfo.lastName) updateData.lastName = parsedData.personalInfo.lastName;
          if (parsedData.personalInfo.email) updateData.email = parsedData.personalInfo.email;
          if (parsedData.personalInfo.phone) updateData.phone = parsedData.personalInfo.phone;
          if (parsedData.personalInfo.address) updateData.address = parsedData.personalInfo.address;
        }
        
        // Extract professional info (delta updates with smart merging)
        if (parsedData.professionalInfo) {
          if (parsedData.professionalInfo.licenses) updateData.licenses = parsedData.professionalInfo.licenses;
          if (parsedData.professionalInfo.specializations) updateData.specializations = parsedData.professionalInfo.specializations;
          
          // Smart merge for primaryConcerns array
          if (parsedData.professionalInfo.primaryConcerns) {
            const existingConcerns = currentTherapist?.primaryConcerns || [];
            const newConcerns = parsedData.professionalInfo.primaryConcerns as string[];
            // Merge and deduplicate
            updateData.primaryConcerns = [...new Set([...existingConcerns, ...newConcerns])];
          }
        }
        
        // Extract style and approach (delta updates with smart merging)
        if (parsedData.styleAndApproach) {
          // Smart merge for therapistStyles array
          if (parsedData.styleAndApproach.therapistStyles) {
            const existingStyles = currentTherapist?.therapistStyles || [];
            const newStyles = parsedData.styleAndApproach.therapistStyles as string[];
            // Merge and deduplicate
            updateData.therapistStyles = [...new Set([...existingStyles, ...newStyles])];
          }
        }
        
        // Extract availability if present - handle merging intelligently
        if (parsedData.availability) {
          let newAvailability: string;
          
          // Convert parsed availability to string if it's an object
          if (typeof parsedData.availability === 'object') {
            newAvailability = JSON.stringify(parsedData.availability, null, 2);
          } else {
            newAvailability = String(parsedData.availability);
          }
          
          // Since the AI should already handle merging in the prompt, we use the AI result
          // But as a fallback, if the AI didn't merge properly, we can do basic merging here
          const existingAvailability = currentTherapist?.availability || '';
          
          if (existingAvailability && !newAvailability.includes(existingAvailability)) {
            // If the new availability doesn't already include the existing availability,
            // and both contain meaningful content, combine them
            if (existingAvailability.trim() && newAvailability.trim()) {
              updateData.availability = `${existingAvailability}, ${newAvailability}`;
            } else {
              updateData.availability = newAvailability;
            }
          } else {
            // AI already handled merging or new availability already includes existing
            updateData.availability = newAvailability;
          }
        }
        
        // Only update if we have data to update
        if (Object.keys(updateData).length > 0) {
          updateTherapist(therapistId, updateData);
          console.log('Updated therapist data with parsed information:', updateData);
        }
      }
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

