const UserReducer = (state: any, action: any) => {
  const { type, payload } = action
  switch (type) {
    case 'ADD':
      return {
        ...state,
        ...payload
      }
    default:
      return state
  }
}

export default UserReducer
