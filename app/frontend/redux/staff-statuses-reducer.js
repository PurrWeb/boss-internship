import { actionTypes } from "./actions.js"
import makeReducer, {makeHandlerForGenericReplaceAction} from "./make-reducer"

export default makeReducer({
    GENERIC_REPLACE_ALL_ITEMS: makeHandlerForGenericReplaceAction("staffStatuses"),
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
