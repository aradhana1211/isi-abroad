import React from 'react'

export interface RouteItem {
  path: string
  layout?: 'guest' | 'default' | 'admin'
  component?: React.ReactElement
  allowedRoles?: string[]
  children?: RouteItem[] | undefined
}

export interface Institute {
  id: number
  name: string
  icon: string
}

export interface Session {
  name: string
}

export interface Program {
  name: string
}

export interface AdvisorType {
  name: string
  photoLink: string
  phoneNumber: string
  email: string
}

export interface StudentMetaType {
  studentCurrentUniversities: string
  countryCitizenship: string
  homeCollegeUniversity: string
  location: string
  program: string
  session: string
  firstName: string
  lastName: string
  preferredPronouns: string
  preferredEmail: string
  collegeMajor: string
  minor: string
  [key: string]: any
}

export interface StudentInfo {
  id: number
  profileImage: string
  alternateEmail: string
  institute: Institute
  session: Session
  program: Program
  advisor: AdvisorType
  studentMeta: StudentMetaType
  createdAt: string
  deletedAt: string
  applicationStatus: string
  cancelWithdrawPolicy: string
}
