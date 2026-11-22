import React from 'react'

export interface valueType {
  instituteId: string | number
  programId: string | number
  sessionId: string | number
}

export interface DataItem {
  icon: string
  name: string
  total: number
}

export interface IconMap {
  [key: string]: React.ReactElement
}

export interface IconBgMap {
  [key: string]: string
}
