import StudentProvider from './context'
import Student from './student'

function App() {
  return (
    <StudentProvider>
      <Student />
    </StudentProvider>
  )
}

export default App
