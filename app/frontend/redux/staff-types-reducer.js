import {actionTypes} from "./actions.js"

export default function staffTypes(state={}, action){
    switch(action.type) {
        case actionTypes.GENERIC_REPLACE_ALL_ITEMS:
            if (action.staffTypes !== undefined) {
                return action.staffTypes
            } else {
                return state;
            }
    }
    return state;
}
