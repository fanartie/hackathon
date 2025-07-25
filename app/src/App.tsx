import './App.css'
import TherapistForm from './components/TherapistForm'
import { TherapistProvider } from './context/TherapistContext'
import TherapistSidebar from './components/TherapistSidebar'
import TherapistNote from './components/TherapistNote'

function App() {
  return (
    <TherapistProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <TherapistSidebar />
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <h1>Therapist Profile Management</h1>
          <TherapistForm />
        </div>
        <TherapistNote />
      </div>
    </TherapistProvider> 
  )
}

export default App
