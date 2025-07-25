import type { TherapistData } from '../context/TherapistContext'

const STORAGE_KEYS = {
  THERAPISTS: 'therapist-profiles',
  NOTES: 'therapist-notes',
  ACTIVE_THERAPIST: 'active-therapist-id',
  IS_CREATING_NEW: 'is-creating-new'
} as const

export const localStorageUtils = {
  // Therapist data functions
  saveTherapists: (therapists: TherapistData[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(therapists))
    } catch (error) {
      console.error('Failed to save therapists to localStorage:', error)
    }
  },

  loadTherapists: (): TherapistData[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THERAPISTS)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load therapists from localStorage:', error)
      return []
    }
  },

  // Notes functions
  saveNotes: (notes: Record<string, string[]>): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error)
    }
  },

  loadNotes: (): Record<string, string[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTES)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Failed to load notes from localStorage:', error)
      return {}
    }
  },

  // Active therapist functions
  saveActiveTherapistId: (therapistId: string | null): void => {
    try {
      if (therapistId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_THERAPIST, therapistId)
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_THERAPIST)
      }
    } catch (error) {
      console.error('Failed to save active therapist ID to localStorage:', error)
    }
  },

  loadActiveTherapistId: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_THERAPIST)
    } catch (error) {
      console.error('Failed to load active therapist ID from localStorage:', error)
      return null
    }
  },

  // Creating new state functions
  saveIsCreatingNew: (isCreatingNew: boolean): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.IS_CREATING_NEW, JSON.stringify(isCreatingNew))
    } catch (error) {
      console.error('Failed to save isCreatingNew state to localStorage:', error)
    }
  },

  loadIsCreatingNew: (): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.IS_CREATING_NEW)
      return stored ? JSON.parse(stored) : true
    } catch (error) {
      console.error('Failed to load isCreatingNew state from localStorage:', error)
      return true
    }
  },

  // Clear all data
  clearAll: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  },

  // Check if localStorage is available
  isAvailable: (): boolean => {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
}