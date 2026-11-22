export type InitialStateType = {
  loading: boolean
  subStepForm: any
  gravityForm: GravityFormType | null
  subFormFields: any
  currentPage: number
  stepFormMeta: any
}

export interface GravityFormType {
  title: string
  button: {
    text: string
    type: string
    imageUrl: string
    location: string
    conditionalLogic: null
  }
  pagination: {
    pages: Array<string> | null
  }
  save: {
    button: {
      text: string
      type: string
    }
    enabled: false
  }
}
export interface SubStepContextType {
  state: InitialStateType
  dispatch: React.Dispatch<SubStepAction>
}

export type SubStepAction = {
  type: ActionType
  payload?: any
}

export enum ActionType {
  SET_LOADING = 'SET_LOADING',
  SET_SUBSTEP_FORM = 'SET_SUBSTEP_FORM',
  NEXT_PAGE = 'NEXT_PAGE',
  PREVIOUS_PAGE = 'PREVIOUS_PAGE',
  SET_META = 'SET_META'
}

export interface FormSubStep {
  id: number
  name: string
  hubspotFormId: string
  type: string
  icon: string
  hasApproved: string
  canBeMarkedAsCompleted: boolean
  canBeDisabled: boolean
}

export interface FormStep {
  id: number
  name: string
  formSubSteps: Array<FormSubStep>
  instructions: string
  completeStepIcon: string
  modifiedStatus: boolean
  recheckStepIcon: string
  titleForStudent: string | null
  titleForAdmin: string | null
}

export interface Institute {
  name: string
  icon: string
}

export interface SubStepInfo {
  id: number
  name: string
  hubspotFormId: string
  type: string
  stepEnabled: boolean
  isApproved: boolean
  isRecheck: boolean
  isCompleted: boolean
  createdAt: string
  formSubStepId: number
  depositPaid: boolean
  invoicePaid: boolean
  healthSpecialNeedsRequested: boolean
  needsNoAccommodation: boolean
  needsAccommodationRequested: boolean
  dueDate: string | null
  depositInvoiceLink: string | null
  isSubmitted: boolean
}

export interface AdvisorType {
  name: string
  photoLink: string
  phoneNumber: string
  email: string
}

export interface DocumentType {
  id: number
  path: string
  name: string
}
export interface StepInfo {
  id: number
  applicationStatus: string
  step1Status: string | null
  step2Status: string | null
  step3Status: string | number | null | boolean
  step4Status: string | null
  studentNote: string
  advisorNote: string
  studentStepInformation: Array<SubStepInfo>
  institute: Array<Institute>
  advisor: AdvisorType
  supportingDocuments: Array<DocumentType>
  billingDepositDocument: string | null
  deletedAt?: string
}

export interface subStepContent {
  id: number
  formSubStepId: number
  fieldName: string
  order: number
  status: number
  structure: any
}

export interface DetailPropsType {
  item: any
  register?: any
  errors?: any
  control?: any
  isRenderConditionalComponent?: boolean
  watch?: any
  onNext?: (event: React.MouseEvent<HTMLElement>) => void
  onPrevious?: (event: React.MouseEvent<HTMLElement>) => void
  setValue?: any
  studentId?: any
  isViewOnly?: boolean
  setOpenModal?: any
}

export interface Icon {
  completeStepIcon: undefined | string
  recheckStepIcon: undefined | string
  readyToReviewStepIcon: undefined | string
}
