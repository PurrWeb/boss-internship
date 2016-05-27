import oFetch from "o-fetch"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("clockInOutAppSelectedStaffType", {
    CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE: function(clientId, action){
        return oFetch(action, "selectedStaffTypeClientId");
    },
    UPDATE_STAFF_STATUS_SUCCESS: function(clientId, action){
        if (oFetch(action, "userIsManagerOrSupervisor")) {
            return clientId;
        } else {
            return null;
        }
    },
    CLOCK_IN_OUT_APP_ENTER_USER_MODE_SUCCESS: function(clientId, action){
        if (oFetch(action, "mode") === "user"){
            // left manager mode
            return null
        }
        else {
            return clientId;
        }
    }
}, {
    initialState: null
});
