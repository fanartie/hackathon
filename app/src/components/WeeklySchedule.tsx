import { useState } from 'react'
import type { WeeklyAvailability, DayAvailability, TimeSlot } from '../types/availability'
import { DAYS_OF_WEEK, DAY_LABELS, isValidTimeSlot, timeToMinutes } from '../types/availability'

interface WeeklyScheduleProps {
  value: WeeklyAvailability
  onChange: (schedule: WeeklyAvailability) => void
  disabled?: boolean
}

const WeeklySchedule = ({ value, onChange, disabled = false }: WeeklyScheduleProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateDayAvailability = (day: keyof WeeklyAvailability, dayData: DayAvailability) => {
    const newSchedule = {
      ...value,
      [day]: dayData
    }
    onChange(newSchedule)
  }

  const toggleDayAvailability = (day: keyof WeeklyAvailability) => {
    const currentDay = value[day]
    const newDay: DayAvailability = {
      isAvailable: !currentDay.isAvailable,
      timeSlots: !currentDay.isAvailable ? [{ start: '09:00', end: '17:00' }] : []
    }
    updateDayAvailability(day, newDay)
  }

  const updateTimeSlot = (day: keyof WeeklyAvailability, slotIndex: number, slot: TimeSlot) => {
    const currentDay = value[day]
    const newTimeSlots = [...currentDay.timeSlots]
    newTimeSlots[slotIndex] = slot
    
    // Validate time slot
    const errorKey = `${day}-${slotIndex}`
    const newErrors = { ...errors }
    
    if (!isValidTimeSlot(slot)) {
      if (timeToMinutes(slot.start) >= timeToMinutes(slot.end)) {
        newErrors[errorKey] = 'Start time must be before end time'
      } else {
        newErrors[errorKey] = 'Invalid time format'
      }
    } else {
      delete newErrors[errorKey]
    }
    
    setErrors(newErrors)
    
    updateDayAvailability(day, {
      ...currentDay,
      timeSlots: newTimeSlots
    })
  }

  const addTimeSlot = (day: keyof WeeklyAvailability) => {
    const currentDay = value[day]
    const lastSlot = currentDay.timeSlots[currentDay.timeSlots.length - 1]
    const newStart = lastSlot ? lastSlot.end : '09:00'
    const newEnd = lastSlot ? '18:00' : '17:00'
    
    updateDayAvailability(day, {
      ...currentDay,
      timeSlots: [...currentDay.timeSlots, { start: newStart, end: newEnd }]
    })
  }

  const removeTimeSlot = (day: keyof WeeklyAvailability, slotIndex: number) => {
    const currentDay = value[day]
    const newTimeSlots = currentDay.timeSlots.filter((_, index) => index !== slotIndex)
    
    // Clear errors for this slot
    const errorKey = `${day}-${slotIndex}`
    const newErrors = { ...errors }
    delete newErrors[errorKey]
    setErrors(newErrors)
    
    updateDayAvailability(day, {
      ...currentDay,
      timeSlots: newTimeSlots
    })
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ 
        margin: '0 0 15px 0', 
        fontSize: '16px', 
        color: '#333',
        borderBottom: '1px solid #eee',
        paddingBottom: '8px'
      }}>
        Weekly Availability
      </h4>
      
      {DAYS_OF_WEEK.map((day) => {
        const dayData = value[day]
        
        return (
          <div
            key={day}
            style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: dayData.isAvailable ? '#f8fff8' : '#f8f8f8'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: dayData.isAvailable ? '12px' : '0'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={dayData.isAvailable}
                  onChange={() => !disabled && toggleDayAvailability(day)}
                  disabled={disabled}
                  style={{ marginRight: '8px' }}
                />
                {DAY_LABELS[day]}
              </label>
              
              {dayData.isAvailable && !disabled && (
                <button
                  onClick={() => addTimeSlot(day)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Time Slot
                </button>
              )}
            </div>
            
            {dayData.isAvailable && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dayData.timeSlots.map((slot, slotIndex) => {
                  const errorKey = `${day}-${slotIndex}`
                  const hasError = errors[errorKey]
                  
                  return (
                    <div key={slotIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1 }}>
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => !disabled && updateTimeSlot(day, slotIndex, { ...slot, start: e.target.value })}
                          disabled={disabled}
                          style={{
                            padding: '6px',
                            fontSize: '13px',
                            border: hasError ? '1px solid #dc3545' : '1px solid #ccc',
                            borderRadius: '3px',
                            backgroundColor: disabled ? '#f5f5f5' : 'white'
                          }}
                        />
                        <span style={{ fontSize: '13px', color: '#666' }}>to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => !disabled && updateTimeSlot(day, slotIndex, { ...slot, end: e.target.value })}
                          disabled={disabled}
                          style={{
                            padding: '6px',
                            fontSize: '13px',
                            border: hasError ? '1px solid #dc3545' : '1px solid #ccc',
                            borderRadius: '3px',
                            backgroundColor: disabled ? '#f5f5f5' : 'white'
                          }}
                        />
                      </div>
                      
                      {!disabled && dayData.timeSlots.length > 1 && (
                        <button
                          onClick={() => removeTimeSlot(day, slotIndex)}
                          style={{
                            padding: '4px 6px',
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
                      
                      {hasError && (
                        <div style={{
                          fontSize: '11px',
                          color: '#dc3545',
                          marginLeft: '5px'
                        }}>
                          {hasError}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            
            {!dayData.isAvailable && (
              <div style={{
                fontSize: '13px',
                color: '#999',
                fontStyle: 'italic',
                marginTop: '5px'
              }}>
                Not available
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default WeeklySchedule