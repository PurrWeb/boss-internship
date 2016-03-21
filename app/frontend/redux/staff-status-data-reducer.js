import {actionTypes} from "./actions.js"

export default function staffStatusData(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_STAFF_STATUS_DATA:
            return action.staffStatusData
    }
    return state;
}