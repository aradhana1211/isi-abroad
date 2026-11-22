import React, { createContext } from 'react'
import { AppContextType, FileUploadResponse, Institute, Program, Session } from './AppTypes'
import http from 'CommonJS/http'
import { toast } from 'Components/Toast/toast'

export const AppContext = createContext<AppContextType | null>(null)

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institutes, setInstitutes] = React.useState<Institute[] | []>([])
  const [sessions, setSessions] = React.useState<Session[] | []>([])
  const [programs, setPrograms] = React.useState<Program[] | []>([])

  const getInstitute = () => {
    http
      .fetch({ path: 'setting/institutes' })
      .then((response) => {
        if (response && response.status === 200) {
          setInstitutes(response.data.institutes)
        }
      })
      .catch(() => {
        toast('Internal server error.', 'error')
      })
  }

  const getSession = () => {
    http
      .fetch({ path: 'setting/sessions' })
      .then((response) => {
        if (response && response.status === 200) {
          setSessions(response.data.sessions)
        }
      })
      .catch(() => {
        toast('Internal server error.', 'error')
      })
  }

  const getPrograms = () => {
    http
      .fetch({ path: 'setting/programs' })
      .then((response) => {
        if (response && response.status === 200) {
          setPrograms(response.data.programs)
        }
      })
      .catch(() => {
        toast('Internal server error.', 'error')
      })
  }

  async function uploadFile(file: File, studentId?: any): Promise<FileUploadResponse | any> {
    try {
      if (file) {
        const blob = new Blob([file as BlobPart])
        const newFormData = new FormData()
        newFormData.append('file', blob, file?.name || '')
        if (studentId) newFormData.append('student', studentId)
        const response = await http.fetch({
          method: 'post',
          path: 'fileUpload',
          data: newFormData,
          options: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        })
        if (response?.data.success) return response.data
        return null
      }
    } catch (error) {
      return null
    }
  }

  async function multipleUploadFile(filelist: FileList, studentId?: any): Promise<FileUploadResponse | any> {
    try {
      if (filelist) {
        const newFormData = new FormData()
        if (filelist && filelist.length > 0) {
          for (let i = 0; i < filelist.length; i++) {
            const file = filelist[i]
            const blob = new Blob([file as BlobPart])
            newFormData.append(`file[${i}]`, blob, file.name || '')
          }
        }
        if (studentId) newFormData.append('student', studentId)
        const response = await http.fetch({
          method: 'post',
          path: 'multipleFileUpload',
          data: newFormData,
          options: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        })
        if (response?.data.success) return response.data
        return null
      }
    } catch (error) {
      return null
    }
  }

  return (
    <AppContext.Provider value={{ institutes, sessions, programs, getInstitute, getSession, getPrograms, uploadFile, multipleUploadFile }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
