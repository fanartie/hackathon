import { useContext } from 'react'
import { TherapistContext } from '../context/types'

export const useTherapist = () => {
  const context = useContext(TherapistContext)
  if (context === undefined) {
    throw new Error('useTherapist must be used within a TherapistProvider')
  }
  return context
}