import React from 'react'
import { reducer } from './reducer'
import { InitialStateType, StudentContextType } from './types'
// import { InitialStateType } from './types'

const initialState = {
  fields: [],
  filters: [],
  column: [],
  students: {
    currentPage: 0,
    data: [],
    firstPageUrl: '',
    from: 0,
    lastPage: 0,
    lastPageUrl: '',
    links: [
      {
        url: '',
        label: '',
        active: false
      }
    ],
    nextPageUrl: '',
    path: '',
    perPage: 0,
    prevPageUrl: '',
    to: 0,
    total: 0
  },
  loading: false
}

export const studentContext = React.createContext<StudentContextType>({ state: initialState, dispatch: () => {} })

const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState as InitialStateType)

  return <studentContext.Provider value={{ state, dispatch }}>{children}</studentContext.Provider>
}

export default StudentProvider
