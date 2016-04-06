import { actionTypes } from "./actions"
import oFetch from "o-fetch"

export default function clockInOutAppSelectedStaffType(clientId=null, action){
    switch(action.type){
        case actionTypes.CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE:
            return oFetch(action, "selectedStaffTypeClientId");
        case actionTypes.UPDATE_STAFF_STATUS_SUCCESS:
            if (oFetch(action, "userIsManagerOrSupervisor")) {
                return clientId;
            } else {
                return null;
            }
        case actionTypes.CLOCK_IN_OUT_APP_ENTER_USER_MODE_SUCCESS:
            if (oFetch(action, "mode") === "user"){
                // left manager mode
                return null
            }
            else {
                return clientId;
            }
    }
    return clientId;
}