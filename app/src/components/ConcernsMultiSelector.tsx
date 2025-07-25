import { useState } from 'react'
import { enum_PresentingConcern, enum_PresentingConcernLabel } from '../spec/concerns'

interface ConcernsMultiSelectorProps {
  selectedConcerns: string[]
  onChange: (concerns: string[]) => void
}

const ConcernsMultiSelector = ({ selectedConcerns, onChange }: ConcernsMultiSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const concernOptions = Object.entries(enum_PresentingConcern).map(([key, value]) => ({
    value,
    label: enum_PresentingConcernLabel[key as keyof typeof enum_PresentingConcernLabel]
  }))

  const handleToggleConcern = (concernValue: string) => {
    if (selectedConcerns.includes(concernValue)) {
      onChange(selectedConcerns.filter(c => c !== concernValue))
    } else {
      onChange([...selectedConcerns, concernValue])
    }
  }

  const handleSelectAll = () => {
    if (selectedConcerns.length === concernOptions.length) {
      onChange([])
    } else {
      onChange(concernOptions.map(option => option.value))
    }
  }

  const getSelectedLabels = () => {
    if (selectedConcerns.length === 0) return 'Select primary concerns...'
    if (selectedConcerns.length === 1) {
      const concern = concernOptions.find(opt => opt.value === selectedConcerns[0])
      return concern?.label || selectedConcerns[0]
    }
    return `${selectedConcerns.length} concerns selected`
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'white',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ 
          color: selectedConcerns.length === 0 ? '#999' : '#333',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {getSelectedLabels()}
        </span>
        <span style={{ marginLeft: '8px', fontSize: '12px' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
            <button
              type="button"
              onClick={handleSelectAll}
              style={{
                width: '100%',
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {selectedConcerns.length === concernOptions.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {concernOptions.map((option) => (
            <label
              key={option.value}
              style={{
                display: 'block',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: selectedConcerns.includes(option.value) ? '#e3f2fd' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!selectedConcerns.includes(option.value)) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5'
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedConcerns.includes(option.value)) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <input
                type="checkbox"
                checked={selectedConcerns.includes(option.value)}
                onChange={() => handleToggleConcern(option.value)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontSize: '13px', lineHeight: '1.3' }}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Click overlay to close dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default ConcernsMultiSelector