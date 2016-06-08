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
    UPDATE_CLOCK_IN_STATUS_FAIL: function(state, action){
        // DONT PROCESS DATE HERE! reducer shouldn't have to do that!!!
        console.log("UPDATE_CLOCK_IN_STATUS_FAIL", arguments)
        return;
    }
})
