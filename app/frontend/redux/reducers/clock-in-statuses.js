import makeDataHandler from "./make-data-handler"
import {registerActionType} from "../actions";

export default makeDataHandler("clockInStatuses",{
    REPLACE_ALL_CLOCK_IN_STATUSES: {
        action: "replaceAll"
    },
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
