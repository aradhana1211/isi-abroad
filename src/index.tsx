import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'Context/AuthContext'
import { UserProvider } from 'Context/UserContext'
import { SnackbarProvider } from 'notistack'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

if (!window.CSS.supports('text-wrap', 'nowrap')) {
  document.addEventListener('DOMContentLoaded', function () {
    const styleTag = document.createElement('style')
    styleTag.textContent = `.text-nowrap { min-width: max-content; }`
    document.head.appendChild(styleTag)
  })
}

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <App />
        </SnackbarProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode >
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
