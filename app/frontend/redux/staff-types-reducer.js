import {actionTypes} from "./actions.js"

export default function staffTypes(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_STAFF_TYPES:
            return action.staffTypes
    }
    return state;
}