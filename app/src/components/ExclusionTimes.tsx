import { useState } from 'react'
import type { ExclusionTime } from '../types/availability'
import { DAYS_OF_WEEK, DAY_LABELS, isValidTime, timeToMinutes } from '../types/availability'

interface ExclusionTimesProps {
  value: ExclusionTime[]
  onChange: (exclusions: ExclusionTime[]) => void
  disabled?: boolean
}

const ExclusionTimes = ({ value, onChange, disabled = false }: ExclusionTimesProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createNewExclusion = (): ExclusionTime => ({
    id: crypto.randomUUID(),
    name: '',
    start: '12:00',
    end: '13:00',
    daysOfWeek: [],
    description: ''
  })

  const addExclusion = () => {
    const newExclusion = createNewExclusion()
    onChange([...value, newExclusion])
  }

  const updateExclusion = (id: string, updates: Partial<ExclusionTime>) => {
    const newExclusions = value.map(exclusion =>
      exclusion.id === id ? { ...exclusion, ...updates } : exclusion
    )
    
    // Validate times if they were updated
    if (updates.start !== undefined || updates.end !== undefined) {
      const updatedExclusion = newExclusions.find(ex => ex.id === id)
      if (updatedExclusion) {
        const newErrors = { ...errors }
        const errorKey = `time-${id}`
        
        if (!isValidTime(updatedExclusion.start) || !isValidTime(updatedExclusion.end)) {
          newErrors[errorKey] = 'Invalid time format'
        } else if (timeToMinutes(updatedExclusion.start) >= timeToMinutes(updatedExclusion.end)) {
          newErrors[errorKey] = 'Start time must be before end time'
        } else {
          delete newErrors[errorKey]
        }
        
        setErrors(newErrors)
      }
    }
    
    onChange(newExclusions)
  }

  const removeExclusion = (id: string) => {
    const newExclusions = value.filter(exclusion => exclusion.id !== id)
    
    // Clear errors for this exclusion
    const newErrors = { ...errors }
    Object.keys(newErrors).forEach(key => {
      if (key.includes(id)) {
        delete newErrors[key]
      }
    })
    setErrors(newErrors)
    
    onChange(newExclusions)
  }

  const toggleDay = (exclusionId: string, day: string) => {
    const exclusion = value.find(ex => ex.id === exclusionId)
    if (!exclusion) return

    const newDaysOfWeek = exclusion.daysOfWeek.includes(day)
      ? exclusion.daysOfWeek.filter(d => d !== day)
      : [...exclusion.daysOfWeek, day]

    updateExclusion(exclusionId, { daysOfWeek: newDaysOfWeek })
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h4 style={{ 
          margin: '0', 
          fontSize: '16px', 
          color: '#333'
        }}>
          Exclusion Times
        </h4>
        {!disabled && (
          <button
            onClick={addExclusion}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            + Add Exclusion
          </button>
        )}
      </div>

      {value.length === 0 ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#999',
          fontSize: '14px',
          fontStyle: 'italic',
          border: '1px dashed #ddd',
          borderRadius: '6px'
        }}>
          No exclusion times defined. These are specific periods within your available hours when you are not available (e.g., lunch breaks, meetings).
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {value.map((exclusion) => {
            const timeError = errors[`time-${exclusion.id}`]
            const nameError = !exclusion.name.trim() ? 'Name is required' : null
            const daysError = exclusion.daysOfWeek.length === 0 ? 'Select at least one day' : null

            return (
              <div
                key={exclusion.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: '#fff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1, marginRight: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                      Name:
                    </label>
                    <input
                      type="text"
                      value={exclusion.name}
                      onChange={(e) => !disabled && updateExclusion(exclusion.id, { name: e.target.value })}
                      placeholder="e.g., Lunch Break, Meeting"
                      disabled={disabled}
                      style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: '13px',
                        border: nameError ? '1px solid #dc3545' : '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: disabled ? '#f5f5f5' : 'white'
                      }}
                    />
                    {nameError && (
                      <div style={{ fontSize: '11px', color: '#dc3545', marginTop: '2px' }}>
                        {nameError}
                      </div>
                    )}
                  </div>
                  
                  {!disabled && (
                    <button
                      onClick={() => removeExclusion(exclusion.id)}
                      style={{
                        padding: '6px 8px',
                        fontSize: '11px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                      Start Time:
                    </label>
                    <input
                      type="time"
                      value={exclusion.start}
                      onChange={(e) => !disabled && updateExclusion(exclusion.id, { start: e.target.value })}
                      disabled={disabled}
                      style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: '13px',
                        border: timeError ? '1px solid #dc3545' : '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: disabled ? '#f5f5f5' : 'white'
                      }}
                    />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                      End Time:
                    </label>
                    <input
                      type="time"
                      value={exclusion.end}
                      onChange={(e) => !disabled && updateExclusion(exclusion.id, { end: e.target.value })}
                      disabled={disabled}
                      style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: '13px',
                        border: timeError ? '1px solid #dc3545' : '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: disabled ? '#f5f5f5' : 'white'
                      }}
                    />
                  </div>
                </div>

                {timeError && (
                  <div style={{ fontSize: '11px', color: '#dc3545', marginBottom: '8px' }}>
                    {timeError}
                  </div>
                )}

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                    Days of Week:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {DAYS_OF_WEEK.map((day) => (
                      <label
                        key={day}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '12px',
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          backgroundColor: exclusion.daysOfWeek.includes(day) ? '#e3f2fd' : 'white'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={exclusion.daysOfWeek.includes(day)}
                          onChange={() => !disabled && toggleDay(exclusion.id, day)}
                          disabled={disabled}
                          style={{ marginRight: '4px' }}
                        />
                        {DAY_LABELS[day].substring(0, 3)}
                      </label>
                    ))}
                  </div>
                  {daysError && (
                    <div style={{ fontSize: '11px', color: '#dc3545', marginTop: '4px' }}>
                      {daysError}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                    Description (Optional):
                  </label>
                  <textarea
                    value={exclusion.description || ''}
                    onChange={(e) => !disabled && updateExclusion(exclusion.id, { description: e.target.value })}
                    placeholder="Additional details about this exclusion time..."
                    disabled={disabled}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '13px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      backgroundColor: disabled ? '#f5f5f5' : 'white',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExclusionTimes