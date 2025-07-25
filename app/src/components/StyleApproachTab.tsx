import { useState } from 'react'
import type { TherapistFormData } from '../context/types'
import { THERAPIST_STYLES } from '../spec/therapistStyles'
import Tooltip from './Tooltip'

interface StyleApproachTabProps {
  therapistData: TherapistFormData
  setTherapistData: (data: TherapistFormData) => void
}

const StyleApproachTab = ({ therapistData, setTherapistData }: StyleApproachTabProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStyles = THERAPIST_STYLES.filter(style =>
    style.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleStyle = (styleId: string) => {
    const currentStyles = therapistData.therapistStyles || []
    const newStyles = currentStyles.includes(styleId)
      ? currentStyles.filter(id => id !== styleId)
      : [...currentStyles, styleId]

    setTherapistData({
      ...therapistData,
      therapistStyles: newStyles
    })
  }

  const clearAllStyles = () => {
    setTherapistData({
      ...therapistData,
      therapistStyles: []
    })
  }

  const selectedCount = (therapistData.therapistStyles || []).length

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#333' }}>
          Therapist Style & Approach
        </h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
          Select the styles and approaches that best describe your therapeutic practice. Hover over each option for more details.
        </p>
        
        {/* Summary and controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '14px', color: '#495057' }}>
            {selectedCount} style{selectedCount !== 1 ? 's' : ''} selected
          </span>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '6px 10px',
                fontSize: '13px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                width: '200px'
              }}
            />
            
            {/* Clear all button */}
            {selectedCount > 0 && (
              <button
                onClick={clearAllStyles}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Styles grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '12px'
      }}>
        {filteredStyles.map((style) => {
          const isSelected = (therapistData.therapistStyles || []).includes(style.id)
          
          return (
            <Tooltip key={style.id} content={style.description} position="top">
              <div
                onClick={() => toggleStyle(style.id)}
                style={{
                  padding: '15px',
                  border: isSelected ? '2px solid #554a94ff' : '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#f8f6ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                    e.currentTarget.style.borderColor = '#adb5bd'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'white'
                    e.currentTarget.style.borderColor = '#ddd'
                  }
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid ' + (isSelected ? '#554a94ff' : '#ccc'),
                  borderRadius: '4px',
                  backgroundColor: isSelected ? '#554a94ff' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  flexShrink: 0
                }}>
                  {isSelected && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5L4.5 8.5L11 1.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* Label and info icon */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    lineHeight: '1.4',
                    marginBottom: '4px'
                  }}>
                    {style.label}
                  </div>
                  
                  <div style={{
                    fontSize: '11px',
                    color: '#6c757d',
                    fontStyle: 'italic'
                  }}>
                    Hover for description
                  </div>
                </div>

                {/* Info icon */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  i
                </div>
              </div>
            </Tooltip>
          )
        })}
      </div>

      {filteredStyles.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6c757d',
          fontSize: '14px',
          fontStyle: 'italic'
        }}>
          No styles found matching "{searchTerm}"
        </div>
      )}

      {/* Selected styles summary */}
      {selectedCount > 0 && (
        <div style={{
          marginTop: '25px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '6px',
          border: '1px solid #bbdefb'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1565c0' }}>
            Selected Styles ({selectedCount}):
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(therapistData.therapistStyles || []).map(styleId => {
              const style = THERAPIST_STYLES.find(s => s.id === styleId)
              return style ? (
                <span
                  key={styleId}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    backgroundColor: '#554a94ff',
                    color: 'white',
                    borderRadius: '12px',
                    display: 'inline-block'
                  }}
                >
                  {style.label}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default StyleApproachTab