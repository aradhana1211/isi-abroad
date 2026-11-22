import http from 'CommonJS/http'

export async function getFieldList() {
  try {
    const response = await http.fetch({ path: 'student/fieldStatus' })
    if (response.data.success) return response.data
    else return false
  } catch (error) {
    return error
  }
}

export async function updateAdvisor(id: number | string, payload: any) {
  try {
    const response = await http.fetch({ method: 'put', path: `student/${id}/updateAdvisor`, data: payload })
    if (response.data.success) return response.data
    else return false
  } catch (error) {
    return error
  }
}

export async function bulkAssignAdvisor(payload: any) {
  try {
    const response = await http.fetch({ method: 'put', path: `student/bulkAssignAdvisor`, data: payload })
    if (response.data.success) return response.data
    else return false
  } catch (error) {
    return error
  }
}

type GetAllStudentsType = {
  pageNumber?: number
  fields: Array<string>
  filterData?: any
  sortOrder?: { columnId: string | null; ascending: boolean }
  perPage?: number
  params?: object
}

export async function getAllStudent({ pageNumber = 1, fields, filterData, sortOrder, perPage, params = {} }: GetAllStudentsType) {
  try {
    const payload: { [key: string]: any } = { fields }

    if (filterData && Object.keys(filterData).length > 0) {
      payload.filter = filterData
    }
    if (sortOrder && Object.keys(sortOrder).length > 0) {
      payload.order = sortOrder
    }

    const response = await http.fetch({
      method: 'post',
      path: 'students',
      data: payload,
      options: {
        params: {
          page: pageNumber,
          perPage: perPage,
          ...params
        }
      }
    })
    if (response.data.success) return response.data
    else return false
  } catch (error) {
    return error
  }
}

export async function getAllAdvisor() {
  try {
    const response = await http.fetch({ path: `advisors` })
    if (response.data.success) return response.data
    else return false
  } catch (error) {
    return error
  }
}
