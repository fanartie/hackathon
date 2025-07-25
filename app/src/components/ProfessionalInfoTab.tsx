import type { TherapistData } from './TherapistForm'

interface ProfessionalInfoTabProps {
  therapistData: TherapistData
  setTherapistData: (data: TherapistData) => void
}

const ProfessionalInfoTab = ({ therapistData, setTherapistData }: ProfessionalInfoTabProps) => {
  return (
    <div className="tab-content">
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Licenses:</label>
        <textarea
          value={therapistData.licenses}
          onChange={(e) => setTherapistData({...therapistData, licenses: e.target.value})}
          placeholder="List your professional licenses and certifications"
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', minHeight: '80px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Primary Concerns:</label>
        <textarea
          value={therapistData.primaryConcerns}
          onChange={(e) => setTherapistData({...therapistData, primaryConcerns: e.target.value})}
          placeholder="What are the main areas you focus on in therapy?"
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', minHeight: '80px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Specializations:</label>
        <textarea
          value={therapistData.specializations}
          onChange={(e) => setTherapistData({...therapistData, specializations: e.target.value})}
          placeholder="List your areas of specialization"
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', minHeight: '80px' }}
        />
      </div>
    </div>
  )
}

export default ProfessionalInfoTab