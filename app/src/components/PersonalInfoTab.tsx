import type { TherapistData } from './TherapistForm'

interface PersonalInfoTabProps {
  therapistData: TherapistData
  setTherapistData: (data: TherapistData) => void
}

const PersonalInfoTab = ({ therapistData, setTherapistData }: PersonalInfoTabProps) => {
  return (
    <div className="tab-content">
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name:</label>
        <input
          type="text"
          value={therapistData.firstName}
          onChange={(e) => setTherapistData({...therapistData, firstName: e.target.value})}
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name:</label>
        <input
          type="text"
          value={therapistData.lastName}
          onChange={(e) => setTherapistData({...therapistData, lastName: e.target.value})}
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
        <input
          type="email"
          value={therapistData.email}
          onChange={(e) => setTherapistData({...therapistData, email: e.target.value})}
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone:</label>
        <input
          type="tel"
          value={therapistData.phone}
          onChange={(e) => setTherapistData({...therapistData, phone: e.target.value})}
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address:</label>
        <textarea
          value={therapistData.address}
          onChange={(e) => setTherapistData({...therapistData, address: e.target.value})}
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', minHeight: '80px' }}
        />
      </div>
      {/* // add checkbox for Wheelchair Accessible */}
    </div>
  )
}

export default PersonalInfoTab