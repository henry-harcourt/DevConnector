import uuid from 'uuid'
import { SET_ALERT, REMOVE_ALERT } from './types'

// thunk allows the double arrrow function
export  const setAlert = (msg, alertType) => dispatch => {
    const id = uuid.v4() // gives us a random long string
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    })
}