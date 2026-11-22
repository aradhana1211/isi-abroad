import { Dayjs } from 'dayjs'

export interface TemplateData {
  id: string
  bannerText: string
  createdAt: string
  startDatetime: string
  endDatetime: string
  isEnabled: boolean
}

export interface Template {
  currentPage: number
  data: TemplateData[]
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

export interface DateFormat {
  endDatetime: Dayjs | null
  startDatetime: Dayjs | null
}

export interface LoginErrorType {
  message?: string
}

export interface Students {
  id: number
  firstName: string
  lastName: string
  location: string
  preferredEmail: string
}

export interface DataItem {
  students: Array<Students>
}

export interface FormDataFields {
  endDatetime: Dayjs | null
  startDatetime: Dayjs | null
  bannerText: string
  instituteIds: number[]
  sessionIds: number[]
  programIds: number[]
  studentIds: number[]
}
