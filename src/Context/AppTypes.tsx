export interface Institute {
  id: number
  name: string
  imagePath: string
}

export interface Session {
  id: number
  name: string
}

export interface Program {
  id: number
  name: string
}

export interface FileUploadResponse {
  success?: boolean
  document?: {
    path: string
    type: string
    id: number
    fullPath: string
  }
  message?: 'File uploaded successfully'
}

export type AppContextType = {
  institutes: Institute[]
  sessions: Session[]
  programs: Program[]
  getInstitute: () => void
  getSession: () => void
  getPrograms: () => void
  uploadFile: (file: File, studentId?: number | string) => FileUploadResponse | any
  multipleUploadFile: (filelist: FileList, studentId?: number | string) => FileUploadResponse | any
}
