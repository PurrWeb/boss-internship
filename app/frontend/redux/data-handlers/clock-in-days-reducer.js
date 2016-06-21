import makeDataHandler from "./make-data-handler"

export default makeDataHandler("clockInDays", {
    REPLACE_ALL_CLOCK_IN_DAYS: {
        action: "replaceAll"
    },
    FORCE_STAFF_MEMBER_CLOCK_OUT_SUCCESS: {
        action: "update",
        generateActionCreator: false
    },
    UPDATE_CLOCK_IN_STATUS_SUCCESS: {
        action: "addOrUpdate"
    },
    UPDATE_CLOCK_IN_STATUS_FAILURE: {
        action: "addOrUpdate",
        shouldIgnoreAction: function(action){
            if (!action.clockInDay) {
                return true;
            }
        }
    }
})