import {actionTypes} from "./actions.js"

export default function staffTypes(state={}, action){
    switch(action.type) {
        case actionTypes.GENERIC_REPLACE_ALL_ITEMS:
            return action.staffTypes
    }
    return state;
}
