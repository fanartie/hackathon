import { useState, useEffect } from 'react'
import PersonalInfoTab from './PersonalInfoTab'
import ProfessionalInfoTab from './ProfessionalInfoTab'
import AvailabilityTab from './AvailabilityTab'
import { useTherapist } from '../hooks/useTherapist'
import { useToast } from '../context/ToastContext'
import type { TherapistFormData } from '../context/types'
import { createDefaultAvailability } from '../types/availability'

const TherapistForm = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [therapistData, setTherapistData] = useState<TherapistFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenses: '',
    primaryConcerns: [],
    specializations: '',
    availability: createDefaultAvailability()
  })
  
  const { activeTherapist, isCreatingNew, saveTherapist, updateTherapist } = useTherapist()
  const { showToast } = useToast()
  
  // Update form data when active therapist changes
  useEffect(() => {
    if (activeTherapist && !isCreatingNew) {
      setTherapistData({
        firstName: activeTherapist.firstName,
        lastName: activeTherapist.lastName,
        email: activeTherapist.email,
        phone: activeTherapist.phone,
        address: activeTherapist.address,
        licenses: activeTherapist.licenses,
        primaryConcerns: activeTherapist.primaryConcerns,
        specializations: activeTherapist.specializations,
        availability: activeTherapist.availability || createDefaultAvailability()
      })
    } else if (isCreatingNew) {
      setTherapistData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        licenses: '',
        primaryConcerns: [],
        specializations: '',
        availability: createDefaultAvailability()
      })
      // Switch to Personal Info tab when creating new profile
      setActiveTab('personal')
    }
  }, [activeTherapist, isCreatingNew])
  
  const handleSave = () => {
    if (!therapistData.firstName || !therapistData.lastName) {
      showToast('Please fill in at least the first name and last name before saving.', 'error')
      return
    }
    
    if (isCreatingNew) {
      saveTherapist(therapistData)
      showToast('Therapist profile saved successfully!', 'success')
    } else if (activeTherapist) {
      updateTherapist(activeTherapist.id, therapistData)
      showToast('Therapist profile updated successfully!', 'success')
    }
  }

  return (
    <section className='therapist-form'>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>
          {isCreatingNew ? 'New Therapist Profile' : `Editing: ${activeTherapist?.firstName} ${activeTherapist?.lastName}`}
        </h2>
        {!isCreatingNew && activeTherapist && (
          <div style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            <div>Created: {new Date(activeTherapist.createdAt).toLocaleDateString()}</div>
            {activeTherapist.updatedAt && activeTherapist.updatedAt !== activeTherapist.createdAt && (
              <div>Updated: {new Date(activeTherapist.updatedAt).toLocaleDateString()}</div>
            )}
          </div>
        )}
      </div>
      
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
            marginRight: '10px',
            backgroundColor: activeTab === 'professional' ? '#554a94ff' : '#f8f9fa',
            color: activeTab === 'professional' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Professional Info
        </button>
        <button 
          onClick={() => setActiveTab('availability')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'availability' ? '#554a94ff' : '#f8f9fa',
            color: activeTab === 'availability' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Availability
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

      {activeTab === 'availability' && (
        <AvailabilityTab 
          value={therapistData.availability}
          onChange={(availability) => setTherapistData(prev => ({ ...prev, availability }))}
        />
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
        >
          {isCreatingNew ? 'Save New Profile' : 'Update Profile'}
        </button>
      </div>
    </section>
  )
}

export default TherapistForm