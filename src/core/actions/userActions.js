import * as CONSTANTS from '../constants'

export const loginUser = (user) =>  {
  return ({
    type: CONSTANTS.LOGIN_USER,
    user: user
  })
}

export const logoutUser = () =>  {
  return ({
    type: CONSTANTS.LOGOUT_USER,
    user: null
  })
}

export const updateUser = (user) =>  {
  return ({
    type: CONSTANTS.UPDATE_USER,
    user: user
  })
}