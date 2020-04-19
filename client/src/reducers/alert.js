import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

const initialState = []

export default function(state = initialState, action) {
    const { type, payload } = action // here we are just destructuring the action so that we don't have to type 'action.etc' under each case

    switch(type) {
        case SET_ALERT:
            return [...state, payload]  // copying state with spread operator here and then dispatching data with action to display 'new alert'
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload) // filter through and return all alerts except for the one that matches the payload
        default:
            return state
    }
}