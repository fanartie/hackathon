import { useTherapist, type TherapistData } from '../context/TherapistContext'

const TherapistSidebar = () => {
  const { 
    savedTherapists, 
    activeTherapist, 
    isCreatingNew,
    selectTherapist, 
    createNewTherapist, 
    deleteTherapist,
    clearAllTherapists 
  } = useTherapist()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadJSON = (therapist: TherapistData) => {
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

  return (
    <div style={{
      width: '300px',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #ddd',
      padding: '20px',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333' }}>
          Therapist Profiles
        </h3>
        
        <button
          onClick={createNewTherapist}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isCreatingNew ? '#28a745' : '#554a94ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '15px'
          }}
        >
          {isCreatingNew ? '✓ Creating New Profile' : '+ New Profile'}
        </button>
      </div>

      {savedTherapists.length > 0 && (
        <>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button
                onClick={downloadAllJSON}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                Export All
              </button>
              <button
                onClick={clearAllTherapists}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                Clear All
              </button>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            {savedTherapists.length} saved profile{savedTherapists.length !== 1 ? 's' : ''}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {savedTherapists.map((therapist) => (
              <div
                key={therapist.id}
                onClick={() => selectTherapist(therapist.id)}
                style={{
                  padding: '12px',
                  backgroundColor: activeTherapist?.id === therapist.id ? '#e3f2fd' : 'white',
                  border: activeTherapist?.id === therapist.id ? '2px solid #2196f3' : '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (activeTherapist?.id !== therapist.id) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0'
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTherapist?.id !== therapist.id) {
                    e.currentTarget.style.backgroundColor = 'white'
                  }
                }}
              >
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '14px', 
                    color: '#333',
                    marginBottom: '2px'
                  }}>
                    {therapist.firstName} {therapist.lastName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {formatDate(therapist.createdAt)}
                  </div>
                </div>
                
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                  {therapist.email && <div>📧 {therapist.email}</div>}
                  {therapist.phone && <div>📞 {therapist.phone}</div>}
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadJSON(therapist)
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    Export
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete ${therapist.firstName} ${therapist.lastName}?`)) {
                        deleteTherapist(therapist.id)
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {savedTherapists.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontSize: '14px',
          fontStyle: 'italic',
          marginTop: '40px'
        }}>
          No profiles saved yet.
          <br />
          Create your first profile!
        </div>
      )}
    </div>
  )
}

export default TherapistSidebar