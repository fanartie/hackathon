import { useState } from 'react'
import './App.css'
import TherapistForm from './components/TherapistForm'

function App() {
  const [textValue, setTextValue] = useState('')

  return (
    <>
        <div >
          <h1>Therapist Profile</h1>
          <section className='therapist-free-text'>
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Enter text here..."
            style={{ padding: '8px', margin: '10px 0', fontSize: '16px' }}
          />
          </section>
          <hr style={{ margin: '20px 0', border: '1px solid #ccc' }} />
          <TherapistForm />
        </div>
    </>
  )
}

export default App
