import StudentDashboard from './Student'
import SubStepProvider from './context'

export default function App() {
  return (
    <SubStepProvider>
      <StudentDashboard />
    </SubStepProvider>
  )
}
