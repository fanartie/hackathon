import { useState, useEffect } from 'react'
import { useTherapist } from '../context/TherapistContext'
import { useToast } from '../context/ToastContext'

const TherapistNote = () => {
  const { activeTherapist, isCreatingNew, saveNote, notes } = useTherapist()
  const { showToast } = useToast()
  const [noteText, setNoteText] = useState('')
  const [savedNotes, setSavedNotes] = useState<string[]>([])
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set())

  // Get notes for current therapist
  useEffect(() => {
    if (activeTherapist && !isCreatingNew) {
      const therapistNotes = notes[activeTherapist.id] || []
      setSavedNotes(therapistNotes)
      setExpandedNotes(new Set()) // Reset expanded notes when switching therapists
    } else {
      setSavedNotes([])
      setExpandedNotes(new Set())
    }
  }, [activeTherapist, isCreatingNew, notes])

  const handleSaveNote = () => {
    console.log('Save note clicked - Input content:', noteText.trim())
    
    if (!noteText.trim()) {
      showToast('Please enter a note before saving.', 'error')
      return
    }

    if (activeTherapist && !isCreatingNew) {
      saveNote(activeTherapist.id, noteText.trim())
      setNoteText('')
      showToast('Note saved successfully!', 'success')
    } else {
      showToast('Please select or create a therapist profile first.', 'warning')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateNote = (note: string, maxLength: number = 80) => {
    if (note.length <= maxLength) return note
    return note.substring(0, maxLength) + '...'
  }

  const toggleNoteExpansion = (noteIndex: number) => {
    const newExpanded = new Set(expandedNotes)
    if (newExpanded.has(noteIndex)) {
      newExpanded.delete(noteIndex)
    } else {
      newExpanded.add(noteIndex)
    }
    setExpandedNotes(newExpanded)
  }

  const exportNotes = () => {
    if (!activeTherapist || savedNotes.length === 0) return

    const notesData = {
      therapist: {
        name: `${activeTherapist.firstName} ${activeTherapist.lastName}`,
        id: activeTherapist.id
      },
      notes: savedNotes,
      exportedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(notesData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `notes-${activeTherapist.firstName}-${activeTherapist.lastName}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div style={{
      width: '350px',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      borderLeft: '1px solid #ddd',
      padding: '20px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#333' }}>
          Therapist Notes
        </h3>
        {activeTherapist && !isCreatingNew ? (
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            Notes for: <strong>{activeTherapist.firstName} {activeTherapist.lastName}</strong>
          </p>
        ) : (
          <p style={{ margin: '0', fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
            Select a therapist to add notes
          </p>
        )}
      </div>

      {/* Note Input Section */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
          Add New Note:
        </label>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder={activeTherapist && !isCreatingNew 
            ? "Enter your note here..." 
            : "Select a therapist profile first"
          }
          disabled={!activeTherapist || isCreatingNew}
          style={{ 
            width: '90%',
            height: '120px',
            padding: '12px', 
            fontSize: '14px', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical',
            fontFamily: 'inherit',
            backgroundColor: (!activeTherapist || isCreatingNew) ? '#f5f5f5' : 'white',
            color: 'black'
          }}
        />
        <button
          onClick={handleSaveNote}
          disabled={!activeTherapist || isCreatingNew || !noteText.trim()}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '10px',
            backgroundColor: (!activeTherapist || isCreatingNew || !noteText.trim()) ? '#ccc' : '#554a94ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (!activeTherapist || isCreatingNew || !noteText.trim()) ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Save Note
        </button>
      </div>

      {/* Saved Notes Section */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ margin: '0', fontSize: '16px', color: '#333' }}>
            Saved Notes ({savedNotes.length})
          </h4>
          {savedNotes.length > 0 && (
            <button
              onClick={exportNotes}
              style={{
                padding: '4px 8px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Export
            </button>
          )}
        </div>

        {savedNotes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {savedNotes.map((note, index) => {
              const isExpanded = expandedNotes.has(index)
              const isTruncated = note.length > 80
              
              return (
                <div
                  key={index}
                  style={{
                    padding: '12px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '13px',
                    lineHeight: '1.4'
                  }}
                >
                  <div style={{ 
                    color: '#666', 
                    fontSize: '11px', 
                    marginBottom: '6px',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '4px'
                  }}>
                    Note #{index + 1} • {formatDate(new Date().toISOString())}
                  </div>
                  <div style={{ color: '#333' }}>
                    {isExpanded ? note : truncateNote(note)}
                  </div>
                  {isTruncated && (
                    <button
                      onClick={() => toggleNoteExpansion(index)}
                      style={{
                        marginTop: '6px',
                        padding: '2px 6px',
                        fontSize: '11px',
                        backgroundColor: 'transparent',
                        color: '#554a94ff',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            fontSize: '14px',
            fontStyle: 'italic',
            marginTop: '40px'
          }}>
            {activeTherapist && !isCreatingNew 
              ? "No notes yet. Add your first note above!"
              : "Select a therapist to view notes."
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default TherapistNote