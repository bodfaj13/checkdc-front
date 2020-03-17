import * as CONSTANTS from '../constants'

const initialState = {
  loading: false,
  user: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.LOGIN_USER:
      return {
        ...state,
        user: action.user
      }
    case CONSTANTS.LOGOUT_USER:
      return {
        ...state,
        user: action.user
      }
    case CONSTANTS.UPDATE_USER:
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}