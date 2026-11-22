import { ActionType, InitialStateType, SubStepAction } from './type'

export const reducer = (state: InitialStateType, action: SubStepAction) => {
  switch (action.type) {
    case ActionType.SET_SUBSTEP_FORM:
      return {
        ...state,
        subStepForm: action.payload,
        gravityForm: action.payload?.gravityForm,
        subFormFields: action.payload?.gravityForm?.fields,
        currentPage: 1
      }
    case ActionType.NEXT_PAGE:
      return { ...state, currentPage: state.currentPage + 1 }
    case ActionType.PREVIOUS_PAGE:
      return { ...state, currentPage: state.currentPage - 1 }
    case ActionType.SET_META:
      return { ...state, stepFormMeta: action.payload }
    default:
      return state
  }
}
