import {actionTypes} from "./actions.js"

export default function holidaysReducer(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_HOLIDAYS:
            return action.holidays
    }
    return state;
}