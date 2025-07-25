import { useState } from 'react'
import './App.css'
import TherapistForm from './components/TherapistForm'
import { TherapistProvider } from './context/TherapistContext'
import TherapistSidebar from './components/TherapistSidebar'

function App() {
  const [textValue, setTextValue] = useState('')

  return (
    <TherapistProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <TherapistSidebar />
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <h1>Therapist Profile Management</h1>
          <section className='therapist-free-text' style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Free Text Input:
            </label>
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Enter free form text here..."
              style={{ 
                padding: '12px', 
                fontSize: '14px', 
                width: '100%', 
                height: '120px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </section>
          <hr style={{ margin: '20px 0', border: '1px solid #ddd' }} />
          <TherapistForm />
        </div>
      </div>
    </TherapistProvider>
  )
}

export default App
