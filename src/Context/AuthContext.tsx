import http from 'CommonJS/http'
import { toast } from 'Components/Toast/toast'
import { createContext, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  children?: ReactNode
}

type TypeAuthContext = {
  authenticated: boolean
  setAuthenticated: (newState: boolean) => void
  Logout: () => void | Promise<void>
}

const initialValue = {
  authenticated: false,
  setAuthenticated: () => {},
  Logout: () => {}
}

const AuthContext = createContext<TypeAuthContext>(initialValue)

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(initialValue.authenticated)
  const navigate = useNavigate()

  async function Logout() {
    return http
      .fetch({ path: 'logout', method: 'post' })
      .catch((error) => {
        toast(error?.response?.data?.message ?? 'Internal server error.', 'error')
      })
      .then((response) => {
        if (response && response.status === 200) {
          localStorage.clear()
          setAuthenticated(false)
          navigate('/login')
        }
      })
  }

  return <AuthContext.Provider value={{ authenticated, setAuthenticated, Logout }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
