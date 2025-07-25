import { CANADIAN_TIMEZONES } from '../types/availability'

interface TimezoneSelectorProps {
  value: string
  onChange: (timezone: string) => void
  disabled?: boolean
}

const TimezoneSelector = ({ value, onChange, disabled = false }: TimezoneSelectorProps) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: 'bold', 
        fontSize: '14px',
        color: '#333'
      }}>
        Timezone:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '14px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: disabled ? '#f5f5f5' : 'white',
          color: disabled ? '#999' : '#333',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        <option value="">Select a timezone...</option>
        {CANADIAN_TIMEZONES.map((timezone) => (
          <option key={timezone.value} value={timezone.value}>
            {timezone.label} ({timezone.province})
          </option>
        ))}
      </select>
      {value && (
        <div style={{
          marginTop: '6px',
          fontSize: '12px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Selected: {CANADIAN_TIMEZONES.find(tz => tz.value === value)?.label}
        </div>
      )}
    </div>
  )
}

export default TimezoneSelector