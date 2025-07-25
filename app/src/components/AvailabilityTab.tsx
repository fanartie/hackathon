// import { useState, useEffect } from 'react'
// import type { AvailabilityData } from '../types/availability'
// import { createDefaultAvailability } from '../types/availability'
// import TimezoneSelector from './TimezoneSelector'
// import WeeklySchedule from './WeeklySchedule'
// import ExclusionTimes from './ExclusionTimes'

interface AvailabilityTabProps {
  value: string
  onChange: (availability: string) => void
  disabled?: boolean
}

const AvailabilityTab = ({ value, onChange, disabled = false }: AvailabilityTabProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div style={{ padding: '20px' }}>
      <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
        Availability
      </label>
      <textarea
        value={value}
        onChange={handleChange}
        disabled={disabled}
        rows={16}
        style={{
          width: '100%',
          fontFamily: 'monospace',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          padding: '10px',
          resize: 'vertical'
        }}
      />
    </div>
  )
}

// const AvailabilityTab = ({ value, onChange, disabled = false }: AvailabilityTabProps) => {
//   const [localAvailability, setLocalAvailability] = useState<AvailabilityData>(value)

//   // Update local state when props change
//   useEffect(() => {
//     setLocalAvailability(value)
//   }, [value])

//   // Update parent when local state changes
//   useEffect(() => {
//     onChange(localAvailability)
//   }, [localAvailability, onChange])

//   const updateTimezone = (timezone: string) => {
//     setLocalAvailability(prev => ({
//       ...prev,
//       timezone
//     }))
//   }

//   const updateWeeklySchedule = (weeklySchedule: AvailabilityData['weeklySchedule']) => {
//     setLocalAvailability(prev => ({
//       ...prev,
//       weeklySchedule
//     }))
//   }

//   const updateExclusions = (exclusions: AvailabilityData['exclusions']) => {
//     setLocalAvailability(prev => ({
//       ...prev,
//       exclusions
//     }))
//   }

//   const resetToDefaults = () => {
//     const defaultAvailability = createDefaultAvailability()
//     setLocalAvailability(defaultAvailability)
//   }

//   const getAvailableDaysCount = () => {
//     return Object.values(localAvailability.weeklySchedule).filter(day => day.isAvailable).length
//   }

//   const getTotalTimeSlots = () => {
//     return Object.values(localAvailability.weeklySchedule)
//       .reduce((total, day) => total + day.timeSlots.length, 0)
//   }

//   return (
//     <div style={{ padding: '20px' }}>
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center',
//         marginBottom: '25px',
//         paddingBottom: '15px',
//         borderBottom: '2px solid #eee'
//       }}>
//         <div>
//           <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#333' }}>
//             Availability Settings
//           </h3>
//           <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
//             Configure your timezone, weekly schedule, and exclusion times
//           </p>
//         </div>
        
//         {!disabled && (
//           <button
//             onClick={resetToDefaults}
//             style={{
//               padding: '8px 16px',
//               fontSize: '13px',
//               backgroundColor: '#6c757d',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Reset to Defaults
//           </button>
//         )}
//       </div>

//       {/* Summary Stats */}
//       <div style={{
//         display: 'flex',
//         gap: '15px',
//         marginBottom: '25px',
//         padding: '15px',
//         backgroundColor: '#f8f9fa',
//         borderRadius: '6px',
//         border: '1px solid #e9ecef'
//       }}>
//         <div style={{ textAlign: 'center', flex: 1 }}>
//           <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
//             {getAvailableDaysCount()}
//           </div>
//           <div style={{ fontSize: '12px', color: '#666' }}>Available Days</div>
//         </div>
//         <div style={{ textAlign: 'center', flex: 1 }}>
//           <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#554a94ff' }}>
//             {getTotalTimeSlots()}
//           </div>
//           <div style={{ fontSize: '12px', color: '#666' }}>Time Slots</div>
//         </div>
//         <div style={{ textAlign: 'center', flex: 1 }}>
//           <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545' }}>
//             {localAvailability.exclusions.length}
//           </div>
//           <div style={{ fontSize: '12px', color: '#666' }}>Exclusions</div>
//         </div>
//       </div>

//       {/* Timezone Selector */}
//       <TimezoneSelector
//         value={localAvailability.timezone}
//         onChange={updateTimezone}
//         disabled={disabled}
//       />

//       {/* Weekly Schedule */}
//       <WeeklySchedule
//         value={localAvailability.weeklySchedule}
//         onChange={updateWeeklySchedule}
//         disabled={disabled}
//       />

//       {/* Exclusion Times */}
//       <ExclusionTimes
//         value={localAvailability.exclusions}
//         onChange={updateExclusions}
//         disabled={disabled}
//       />

//       {/* Help Text */}
//       <div style={{
//         marginTop: '25px',
//         padding: '15px',
//         backgroundColor: '#e3f2fd',
//         borderRadius: '6px',
//         fontSize: '13px',
//         color: '#1565c0'
//       }}>
//         <strong>How it works:</strong>
//         <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
//           <li>Set your timezone to ensure accurate scheduling</li>
//           <li>Define your weekly availability by day and time slots</li>
//           <li>Add exclusion times for breaks, meetings, or other unavailable periods</li>
//           <li>Exclusions apply only during your available hours on selected days</li>
//         </ul>
//       </div>
//     </div>
//   )
// }

export default AvailabilityTab