import { User } from 'src/models'
import * as actions from 'src/actions'

export const userReducer = (
  state = {
    loggedInUser: null as Nullable<User>,
  },
  action: actions.ActionType
) => {
  switch (action.type) {
    case actions.SET_LOGGED_IN_USER:
      return {
        ...state,
        loggedInUser: action.payload,
      }
    default:
      return state
  }
}
