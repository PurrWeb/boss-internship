import { actionTypes } from "./actions.js"

export default function staffStatuses(state={}, action){
    switch (action.type) {
        case actionTypes.REPLACE_ALL_STAFF_STATUSES:
            return action.staffStatuses;
    }
    return state;
}