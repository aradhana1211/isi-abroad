import React from 'react'
import { reducer } from './reducer'
import { InitialStateType, SubStepContextType } from './type'

const initialState = {
  loading: false,
  subStepForm: null,
  gravityForm: null,
  subFormFields: null,
  currentPage: 1,
  stepFormMeta: {}
}

export const subStepContext = React.createContext<SubStepContextType>({ state: initialState, dispatch: () => {} })

const SubStepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState as InitialStateType)

  return <subStepContext.Provider value={{ state, dispatch }}>{children}</subStepContext.Provider>
}

export default SubStepProvider
