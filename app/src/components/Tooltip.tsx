import { useState, type ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const getTooltipPosition = () => {
    const baseStyle = {
      position: 'absolute' as const,
      backgroundColor: '#333',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '13px',
      lineHeight: '1.4',
      maxWidth: '300px',
      zIndex: 1000,
      whiteSpace: 'normal' as const,
      wordWrap: 'break-word' as const,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' as const : 'hidden' as const,
      transition: 'opacity 0.2s, visibility 0.2s',
      pointerEvents: 'none' as const
    }

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px'
        }
      case 'bottom':
        return {
          ...baseStyle,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px'
        }
      case 'left':
        return {
          ...baseStyle,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px'
        }
      case 'right':
        return {
          ...baseStyle,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px'
        }
      default:
        return baseStyle
    }
  }

  const getArrowStyle = () => {
    const arrowSize = '6px'
    const arrowColor = '#333'
    
    const baseArrowStyle = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      border: `${arrowSize} solid transparent`,
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' as const : 'hidden' as const,
      transition: 'opacity 0.2s, visibility 0.2s'
    }

    switch (position) {
      case 'top':
        return {
          ...baseArrowStyle,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTopColor: arrowColor,
          borderBottomWidth: 0
        }
      case 'bottom':
        return {
          ...baseArrowStyle,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottomColor: arrowColor,
          borderTopWidth: 0
        }
      case 'left':
        return {
          ...baseArrowStyle,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderLeftColor: arrowColor,
          borderRightWidth: 0
        }
      case 'right':
        return {
          ...baseArrowStyle,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRightColor: arrowColor,
          borderLeftWidth: 0
        }
      default:
        return baseArrowStyle
    }
  }

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div style={getTooltipPosition()}>
        {content}
        <div style={getArrowStyle()} />
      </div>
    </div>
  )
}

export default Tooltip