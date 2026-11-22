import React from 'react'

export interface StudentContextType {
  state: InitialStateType
  dispatch: React.Dispatch<StudentAction>
}

export type Fields = {
  label: string
  id: string
  filterColumnOrder: number
  isDefault: boolean
  isDisabled: boolean
  isFilterable?: boolean
  fieldName: string
}

interface StudentType {
  id: number
  applicationStatus: string | null
  studentNote: string | null
  advisorNote: string | null
  supportingDocuments: string | null
  step1Status: string | null
  step2Status: string | null
  step3Status: number
  insuranceLink: string | null
  preDepartureWebpageLink: string | null
  preDepartureCourseLink: string | null
  smartPhoneAppLink: string | null
  smartPhoneAppLink2: string | null
  unsignedOptionLink: string | null
  createdAt: string | null
  updatedAt: string | null
  userId: number
  advisorId: number | null
  countryCitizenshipId: number | null
  homeCollegeId: number | null
  instituteId: number | null
  sessionId: number | null
  programId: number | null
  advisor: {
    id: number
    name: string
    email: string
    emailVerifiedAt: null
    twoFactorSecret: null
    twoFactorRecoveryCodes: null
    twoFactorConfirmedAt: null
    lastLogin: null
    createdAt: string
    updatedAt: string
    roles: Array<string>
  } | null
}

export type FilterOject = {
  id: string
  fieldName: string
  label: string
  choices: Array<{ id: number; name: string }>
}

export type InitialStateType = {
  fields: Fields[] | []
  filters: FilterOject[] | []
  students: {
    currentPage: number | 0
    data: StudentType[] | []
    firstPageUrl: string
    from: number
    lastPage: number
    lastPageUrl: string
    links: {
      url: string | null
      label: string
      active: boolean
    }[]
    nextPageUrl: string | null
    path: string
    perPage: number
    prevPageUrl: string | null
    to: number
    total: number
  }
  column: Array<string>
  loading: boolean
}

export enum ActionType {
  SET_LOADING = 'SET_LOADING',
  SET_FIELDS = 'SET_FIELDS',
  SET_FILTERS = 'SET_FILTERS',
  SET_COLUMN = 'SET_COLUMN',
  SET_STUDENTS = 'SET_STUDENTS'
}

export type StudentAction = {
  type: ActionType
  payload?: any
}

export type AdvisorType = {
  id: number
  name: string
  photoLink: string
  phoneNumber: string
  user: {
    id: number
    email: string
    roles: Array<string>
  }
}
