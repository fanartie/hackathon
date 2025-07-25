import type { TherapistFormData } from '../context/types'
import ConcernsMultiSelector from './ConcernsMultiSelector'

interface ProfessionalInfoTabProps {
  therapistData: TherapistFormData
  setTherapistData: (data: TherapistFormData) => void
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
        <ConcernsMultiSelector
          selectedConcerns={therapistData.primaryConcerns}
          onChange={(concerns) => setTherapistData({...therapistData, primaryConcerns: concerns})}
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