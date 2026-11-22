export interface FormSubStep {
  id: number
  name: string
  hubspotFormId: string
  type: string
  icon: string
}

export interface FormStep {
  id: number
  name: string
  formSubSteps: Array<FormSubStep>
  instructions: string
  isDefaultSetting: boolean
  titleForAdmin: string | null
  titleForStudent: string | null
}

export interface Setting {
  recheckStepIcon?: string
  completeStepIcon?: string
  readyToReviewStepIcon?: string
}
