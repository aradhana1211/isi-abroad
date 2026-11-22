import { Switch } from '@mui/material'
import http from 'CommonJS/http'
import AdminSetting from 'Components/AdminSetting'
import Loading from 'Components/Loading'
import { useEffect, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BsQuestionCircleFill } from 'react-icons/bs'
import Tooltip from '@mui/material/Tooltip'
import { toast } from 'Components/Toast/toast'

export default function FieldFilter() {
  interface FieldData {
    id: string
    label: string
    createdAt: string
    fieldName: string
    filterColumnOrder: number
    isFilterable: boolean
    isDefault: boolean
  }

  const [fields, setFields] = useState<FieldData[]>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getFieldsData()
  }, [])

  const getFieldsData = async () => {
    await setLoading(true)
    await http
      .fetch({ path: '/setting/fields' })
      .catch(() => {
        toast('Internal Server Error.', 'error')
        setLoading(false)
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          setFields(response.data.fields)
        }
      })
    await setLoading(false)
  }

  const handleChange = (newField: FieldData, refreshTable: boolean = true) => {
    const newData = newField
    http
      .fetch({ method: `put`, path: `/setting/fields/${newField?.id}`, data: newData })
      .catch((error: any) => {
        toast(error.response?.data?.message || 'Internal server error', 'error')
      })
      .then((response: any) => {
        setLoading(false)
        if (response && response.status === 200) {
          toast(response?.data?.message || 'Successfully updated data', 'success')
          if (refreshTable) {
            getFieldsData()
          }
        }
      })
  }

  interface DragItem {
    type: string
    id: string
  }

  const TableRow = (field: FieldData) => {
    const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
      type: 'ROW',
      item: { type: 'ROW', id: field.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    })

    const [, drop] = useDrop({
      accept: 'ROW',
      drop: (droppedItem: { type: string; id: string }) => {
        // `Item with ID ${droppedItem.id} dropped on row with ID ${field.filterColumnOrder}`
        const filteredObject = fields?.find((item) => item.id == droppedItem.id)
        if (filteredObject) {
          const updatedField = { ...filteredObject, filterColumnOrder: field?.filterColumnOrder }
          handleChange(updatedField)
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    })
    const opacity = isDragging ? 0 : 1

    return (
      <tr
        ref={(node) => {
          drag(drop(node))
        }}
        style={{ zIndex: 100, opacity, cursor: 'grab' }}
      >
        <td>
          <input
            type='text'
            className='form-input'
            defaultValue={field?.label}
            placeholder={`Enter ${field?.label}`}
            onBlur={(e) => {
              const updatedField = { ...field, label: e.target.value }
              setLoading(true)
              handleChange(updatedField)
            }}
            name={'label'}
          />
        </td>
        <td>
          <input
            type='number'
            className='form-input w-20'
            defaultValue={field?.filterColumnOrder}
            placeholder='Enter filter column order'
            onBlur={(e) => {
              const val = e.target.value
              const updatedField = { ...field, filterColumnOrder: val !== '' ? Number(parseInt(val)) : field.filterColumnOrder }
              e.target.value = String(updatedField.filterColumnOrder)
              handleChange(updatedField, false)
            }}
            name={'filterColumnOrder'}
          />
        </td>
        <td>
          <Switch
            checked={field?.isFilterable}
            inputProps={{ 'aria-label': 'controlled' }}
            onChange={(e) => {
              const updatedField = { ...field, isFilterable: e.target.checked }
              setLoading(true)
              handleChange(updatedField)
            }}
          />
        </td>
        <td>
          <Switch
            checked={field?.isDefault}
            inputProps={{ 'aria-label': 'controlled' }}
            onChange={(e) => {
              const updatedField = { ...field, isDefault: e.target.checked }
              setLoading(true)
              handleChange(updatedField)
            }}
          />
        </td>
      </tr>
    )
  }

  return (
    <>
      {loading && <Loading />}
      <div className='flex w-full min-h-screen md:flex-wrap md:min-h-full'>
        <AdminSetting />
        <div className='px-7 py-5 w-full lg:px-4' data-cy='email-template-page'>
          <div className='flex gap-3 md:gap-1 md:justify-between items-center'>
            <h1 className='md:font-2xl text-3xl font-bold decoration-1'>Students Fields Filter</h1>
            <Tooltip
              title='When you change the information in a box (Label Or Order), it will be saved automatically once you click outside the box.'
              classes={{ popper: '[&_div]:text-base' }}
              enterTouchDelay={1}
              placement='bottom'
              arrow
            >
              <span>
                <BsQuestionCircleFill className='size-5 md:size-7 mt-1 text-slate-400 cursor-pointer' />
              </span>
            </Tooltip>
          </div>

          <div className='overflow-auto'>
            <table className='w-full mt-5 lg:w-max' data-cy='email-template-table'>
              <thead>
                <tr className='[&>*]:bg-primary [&>*]:text-white [&>*]:tracking-wider [&>*]:py-3 [&>*]:border-slate-500 [&>*]:text-left'>
                  {/* <th>Id</th> */}
                  <th>Label</th>
                  <th>Order</th>
                  <th>Filterable?</th>
                  <th>Default?</th>
                </tr>
              </thead>
              <tbody>
                <DndProvider debugMode={true} backend={HTML5Backend}>
                  {fields?.length === 0 || !fields ? (
                    <>
                      <tr>
                        <td colSpan={6}>No Fields Found</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {fields
                        ?.sort(function (a, b) {
                          return a.filterColumnOrder - b.filterColumnOrder
                        })
                        .map((field) => <TableRow key={field.id} {...field} />)}
                    </>
                  )}
                </DndProvider>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
