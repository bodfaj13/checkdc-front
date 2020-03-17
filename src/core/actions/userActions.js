import * as CONSTANTS from '../constants'

export const loginUser = (user) => (dispatch) => {
  dispatch({
    type: CONSTANTS.LOGIN_USER,
    user: user
  })
}

export const logoutUser = () => (dispatch) => {
  dispatch({
    type: CONSTANTS.LOGOUT_USER,
    user: null
  })
}

export const updateUser = (user) => (dispatch) => {
  dispatch({
    type: CONSTANTS.UPDATE_USER,
    user: user
  })
}