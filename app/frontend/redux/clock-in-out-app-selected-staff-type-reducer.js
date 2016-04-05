import { actionTypes } from "./actions"
import oFetch from "o-fetch"

export default function clockInOutAppSelectedStaffType(clientId=null, action){
    if (action.type === actionTypes.CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE) {
        return oFetch(action, "selectedStaffTypeClientId");
    }
    return clientId;
}