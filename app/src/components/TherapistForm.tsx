import { useState } from 'react'
import PersonalInfoTab from './PersonalInfoTab'
import ProfessionalInfoTab from './ProfessionalInfoTab'

export interface TherapistData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  licenses: string
  primaryConcerns: string
  specializations: string
}

const TherapistForm = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [therapistData, setTherapistData] = useState<TherapistData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenses: '',
    primaryConcerns: '',
    specializations: ''
  })

  return (
    <section className='therapist-form'>
      <h2>Therapist Information Form</h2>
      
      <div className="tabs" style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('personal')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'personal' ? '#554a94ff' : '#f8f9fa',
            color: activeTab === 'personal' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Personal Info
        </button>
        <button 
          onClick={() => setActiveTab('professional')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'professional' ? '#554a94ff' : '#f8f9fa',
            color: activeTab === 'professional' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Professional Info
        </button>
      </div>

      {activeTab === 'personal' && (
        <PersonalInfoTab 
          therapistData={therapistData} 
          setTherapistData={setTherapistData} 
        />
      )}

      {activeTab === 'professional' && (
        <ProfessionalInfoTab 
          therapistData={therapistData} 
          setTherapistData={setTherapistData} 
        />
      )}
    </section>
  )
}

export default TherapistForm