import { useEffect, useState } from 'react'

export interface ToastData {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastProps {
  toast: ToastData
  onRemove: (id: string) => void
}

const Toast = ({ toast, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10)
    
    // Auto-remove timer
    const duration = toast.duration || 4000
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onRemove(toast.id), 300) // Wait for exit animation
    }, duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
    }
  }, [toast.id, toast.duration, onRemove])

  const getToastStyles = () => {
    const baseStyles = {
      padding: '12px 16px',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      fontSize: '14px',
      fontWeight: '500',
      maxWidth: '400px',
      minWidth: '300px',
      position: 'relative' as const,
      transform: isVisible && !isExiting ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible && !isExiting ? 1 : 0,
      transition: 'all 0.3s ease-out',
      marginBottom: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }

    const typeStyles = {
      success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb'
      },
      error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb'
      },
      warning: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeaa7'
      },
      info: {
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        border: '1px solid #bee5eb'
      }
    }

    return { ...baseStyles, ...typeStyles[toast.type] }
  }

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }
    return icons[toast.type]
  }

  const handleClick = () => {
    setIsExiting(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <div style={getToastStyles()} onClick={handleClick}>
      <span>{getIcon()}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <span style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        opacity: 0.7,
        lineHeight: 1
      }}>
        ×
      </span>
    </div>
  )
}

export default Toast