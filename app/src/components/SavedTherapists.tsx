import { useTherapist } from '../context/TherapistContext'
import { enum_PresentingConcern, enum_PresentingConcernLabel } from '../spec/concerns'

const SavedTherapists = () => {
  const { savedTherapists, deleteTherapist, clearAllTherapists } = useTherapist()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatConcerns = (concerns: string[]) => {
    if (!concerns || concerns.length === 0) return 'Not provided'
    
    return concerns.map(concern => {
      const key = Object.keys(enum_PresentingConcern).find(
        k => enum_PresentingConcern[k as keyof typeof enum_PresentingConcern] === concern
      )
      return key ? enum_PresentingConcernLabel[key as keyof typeof enum_PresentingConcernLabel] : concern
    }).join(', ')
  }

  const downloadJSON = (therapist: any) => {
    const dataStr = JSON.stringify(therapist, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `therapist-${therapist.firstName}-${therapist.lastName}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const downloadAllJSON = () => {
    const dataStr = JSON.stringify(savedTherapists, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'all-therapists.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (savedTherapists.length === 0) {
    return (
      <section>
        <h2>Saved Therapist Profiles</h2>
        <p style={{ color: '#666', fontStyle: 'italic' }}>No therapist profiles saved yet.</p>
      </section>
    )
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Saved Therapist Profiles ({savedTherapists.length})</h2>
        <div>
          <button
            onClick={downloadAllJSON}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Download All JSON
          </button>
          <button
            onClick={clearAllTherapists}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {savedTherapists.map((therapist) => (
          <div
            key={therapist.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  {therapist.firstName} {therapist.lastName}
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                  Saved: {formatDate(therapist.createdAt)}
                </p>
              </div>
              <div>
                <button
                  onClick={() => downloadJSON(therapist)}
                  style={{
                    padding: '6px 12px',
                    marginRight: '8px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Download JSON
                </button>
                <button
                  onClick={() => deleteTherapist(therapist.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
              <div>
                <strong>Personal Information:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  <li>Email: {therapist.email || 'Not provided'}</li>
                  <li>Phone: {therapist.phone || 'Not provided'}</li>
                  <li>Address: {therapist.address || 'Not provided'}</li>
                </ul>
              </div>
              <div>
                <strong>Professional Information:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  <li>Licenses: {therapist.licenses || 'Not provided'}</li>
                  <li>Primary Concerns: {formatConcerns(therapist.primaryConcerns)}</li>
                  <li>Specializations: {therapist.specializations || 'Not provided'}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SavedTherapists