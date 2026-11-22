import { ActionType, InitialStateType, StudentAction } from './types'

export const reducer = (state: InitialStateType, action: StudentAction) => {
  switch (action.type) {
    default:
    case ActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case ActionType.SET_FIELDS:
      return { ...state, fields: action.payload }
    case ActionType.SET_FILTERS:
      return { ...state, filters: action.payload }
    case ActionType.SET_COLUMN:
      return { ...state, column: action.payload }
    case ActionType.SET_STUDENTS:
      return { ...state, students: action.payload }
      return state
  }
}
