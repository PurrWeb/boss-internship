import makeReducer, {makeHandlerForGenericReplaceAction} from "./make-reducer"
import {registerActionType} from "../actions/action-types"
import {registerDefaultAction} from "../actions";

export default makeReducer({
    REPLACE_ALL_CLOCK_IN_STATUSES: makeHandlerForGenericReplaceAction("clockInStatuses"),
    UPDATE_STAFF_STATUS_SUCCESS: function(state, action){
        var clientId = action.staffMemberObject.clientId;
        var newStatusObject = state[clientId];
        newStatusObject = Object.assign({}, newStatusObject, {
            status: action.statusValue
        })
        return Object.assign({}, state, {
            [clientId]: newStatusObject
        });
    }
})
