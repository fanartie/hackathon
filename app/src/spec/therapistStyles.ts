export interface TherapistStyle {
  id: string
  label: string
  description: string
}

export const THERAPIST_STYLES: TherapistStyle[] = [
  {
    id: 'logical_teaching',
    label: 'Logical/Teaching-oriented',
    description: 'Explains psychological concepts and research in a clear, practical way, helping clients view their challenges and symptoms with a more analytical perspective.'
  },
  {
    id: 'bubbly',
    label: 'Bubbly',
    description: 'Lively, high energy presence'
  },
  {
    id: 'casual',
    label: 'Casual',
    description: 'Communicates in an easygoing way, relaxed demeanor, like talking with a friend. May use slang, conversational tone, or informal language (i.e. cursing where appropriate) to create a comfortable atmosphere.'
  },
  {
    id: 'inquisitive_challenges',
    label: 'Inquisitive Approach/Challenges Client',
    description: 'Consistently uses thought-provoking questions to encourage deep reflection, pushes clients to recognize and confront personal roadblocks, prompts to examine unhelpful thought patterns'
  },
  {
    id: 'direct_accountable',
    label: 'Direct Communication/Holds Client Accountable',
    description: 'Communicates clearly and confidently, providing direct feedback and observations. Encourages accountability in various ways (e.g., following up on \'between session\' tasks, highlighting misalignment between actions and goals, etc.).'
  },
  {
    id: 'exploratory',
    label: 'Exploratory',
    description: 'Engages in discussion through thoughtful probing, reflection, and open-ended questions, thoughtfully intervening in the discussion to offer insights or guidance.'
  },
  {
    id: 'formal_professional',
    label: 'Formal/Professional',
    description: 'Therapist demeanor is more formal and polished in their use of language, business attire, posture, etc.'
  },
  {
    id: 'shares_personal',
    label: 'Shares Personal Experiences',
    description: 'Shares examples or aspects of their own life to explain therapeutic concepts or demonstrate understanding'
  },
  {
    id: 'calm_presence',
    label: 'Calm Presence',
    description: 'Therapist has a more naturally quiet, composed demeanor.'
  },
  {
    id: 'holistic',
    label: 'Holistic',
    description: 'Emphasizes the connection between mental, emotional, spiritual, and physical health. May discuss or educate on complementary practices like yoga or nutritional health but does not incorporate them directly into sessions.'
  },
  {
    id: 'humor',
    label: 'Utilizes Humour',
    description: 'Using humour if/when appropriate to build rapport or make the content more approachable and relatable'
  },
  {
    id: 'skills_focused',
    label: 'Skills-focused',
    description: 'Teaches concrete skills and applies learnt skills actively during and/or between sessions'
  },
  {
    id: 'structured',
    label: 'Structured',
    description: 'Session structure is more organized, following a specific agenda or plan as set out together by the client and therapist.'
  },
  {
    id: 'solution_oriented',
    label: 'Solution Oriented',
    description: 'Takes an active role in sessions, identifying practical solutions. Helps clients work toward clear, actionable, tangible goals.'
  },
  {
    id: 'body_based',
    label: 'Sensations/Body-Based',
    description: 'Utilizes therapy approaches that emphasize body awareness, physical sensations, and connection between the mind and body.'
  },
  {
    id: 'reflective_activities',
    label: 'Reflective/Experience Based Activities between Sessions',
    description: 'Provides activities that focus on reflection and exploration, not following a rigid structure (i.e. mindfulness, journaling, practicing interpersonal skills such as communication, reflecting on information, behaviour experiments).'
  },
  {
    id: 'task_oriented_activities',
    label: 'Task-Oriented/Teaching Oriented Activities between sessions',
    description: 'Involves specific, trackable tasks like worksheets, assigned readings, watching a video, or completing step-by-step activities. These assignments are easy to track and provide a clear sense of completion.'
  }
]