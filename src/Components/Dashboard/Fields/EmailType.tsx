/* eslint-disable no-useless-escape */
import { useContext } from 'react'
import Label from '../Label'
import { DetailPropsType } from '../type'
import { subStepContext } from '../context'
import { Controller } from 'react-hook-form'

function EmailType({ item, control, isRenderConditionalComponent, watch, isViewOnly }: DetailPropsType) {
  const {
    state: { currentPage }
  } = useContext(subStepContext)

  if ((item?.conditionalLogic && isRenderConditionalComponent === false) || currentPage !== item?.pageNumber) return null

  return (
    <div className='mt-2'>
      <div className='flex justify-start'>
        <Label structure={item} />
        <div className='flex justify-start w-[70%] gap-x-1'>
          {item.inputs ? (
            item.inputs?.map((fields: any, index: number) => {
              if (fields?.isHidden) return null
              else {
                return (
                  <div key={index} className='mb-6 md:mb-3 w-[-webkit-fill-available]'>
                    <label className='block uppercase tracking-wide text-gray-500 text-sm mb-2' htmlFor='grid-first-name'>
                      {fields.label}
                    </label>
                    {index === 0 ? (
                      <Controller
                        control={control}
                        name={item?.inputName?.toLowerCase()}
                        rules={
                          isViewOnly
                            ? {}
                            : {
                                required: { value: item?.isRequired, message: 'This field is required.' },
                                pattern: {
                                  value:
                                    /^(([^<>()[\].,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                                  message: 'The email address entered is invalid'
                                }
                              }
                        }
                        render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
                          return (
                            <div>
                              <input
                                className='form-input'
                                ref={ref}
                                value={value ?? ''}
                                onChange={onChange}
                                type='text'
                                disabled={isViewOnly}
                              />
                              {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
                            </div>
                          )
                        }}
                      />
                    ) : (
                      <Controller
                        control={control}
                        name={`${item?.inputName}_confirm_email`}
                        rules={
                          isViewOnly
                            ? {}
                            : {
                                required: { value: item?.isRequired, message: 'This field is required.' },
                                pattern: {
                                  value:
                                    /^(([^<>()[\].,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                                  message: 'The email address entered is invalid'
                                },
                                validate: (val: string) => {
                                  if (watch(item?.inputName) != val) {
                                    return 'Your email do no match'
                                  }
                                }
                              }
                        }
                        render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
                          return (
                            <div>
                              <input
                                className='form-input'
                                ref={ref}
                                value={value ?? ''}
                                onChange={onChange}
                                type='text'
                                disabled={isViewOnly}
                              />
                              {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
                            </div>
                          )
                        }}
                      />
                    )}
                  </div>
                )
              }
            })
          ) : (
            <Controller
              control={control}
              name={item?.inputName?.toLowerCase()}
              rules={
                isViewOnly
                  ? {}
                  : {
                      required: { value: item?.isRequired, message: 'This field is required.' },
                      pattern: {
                        value:
                          /^(([^<>()[\].,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                        message: 'The email address entered is invalid'
                      }
                    }
              }
              render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
                return (
                  <div>
                    <input className='form-input' type='text' ref={ref} value={value ?? ''} onChange={onChange} disabled={isViewOnly} />
                    {error && <p className='text-left text-red-500 text-sm'>{error?.message}</p>}
                  </div>
                )
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default EmailType
