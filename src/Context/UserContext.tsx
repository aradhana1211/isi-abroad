import { createContext, ReactNode, useReducer } from 'react'
import UserReducer from './reducer'

type Props = {
  children?: ReactNode
}
interface adviorsObject {
  id: number
  phoneNumber: string
  photoLink: string
}
interface studentObject {
  id: number
}

type TypeUserContext = {
  data: {
    id: number
    name: string
    email: string
    advisor?: adviorsObject
    student?: studentObject
    emailVerifiedAt?: string | null
    twoFactorSecret?: string | null
    twoFactorRecoveryCodes?: string[] | null
    twoFactorConfirmedAt?: string | null
    roles: Array<string>
    lastLogin: string
    createdAt: string
    updatedAt: string
    filterableFields: string[] | null
    displayFields: string[] | null
  }
  dispatch: (newState: any) => void
}

const initialValue = {
  data: {
    id: 0,
    name: '',
    email: '',
    emailVerifiedAt: null,
    twoFactorSecret: null,
    twoFactorRecoveryCodes: null,
    twoFactorConfirmedAt: null,
    roles: [''],
    advisor: {
      id: 0,
      phoneNumber: '',
      photoLink: ''
    },
    student: {
      id: 0
    },
    lastLogin: '',
    createdAt: '',
    updatedAt: '',
    filterableFields: [''],
    displayFields: ['']
  },
  dispatch: () => {}
}

const UserContext = createContext<TypeUserContext>(initialValue)

const loadPersistedData = () => {
  const persistedData = localStorage.getItem('user')
  const data = persistedData ? JSON.parse(persistedData) : initialValue.data

  if (data?.roles.includes('student') && !data.student) {
    localStorage.clear() // to trigger logout
  }

  return data
}

const UserProvider = ({ children }: Props) => {
  const [data, dispatch] = useReducer(UserReducer, loadPersistedData())

  return <UserContext.Provider value={{ data, dispatch }}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }
