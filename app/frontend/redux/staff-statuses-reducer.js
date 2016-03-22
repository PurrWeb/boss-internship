import { actionTypes } from "./actions.js"

export default function staffStatuses(state={}, action){
    switch (action.type) {
        case actionTypes.REPLACE_ALL_STAFF_STATUSES:
            return action.staffStatuses;
        case actionTypes.UPDATE_STAFF_STATUS_SUCCESS:
            var clientId = action.staffMemberObject.clientId;
            var newStatusObject = state[clientId];
            newStatusObject = Object.assign({}, newStatusObject, {
                status: action.statusValue
            })
            return Object.assign({}, state, {
                [clientId]: newStatusObject
            });
    }
    return state;
}