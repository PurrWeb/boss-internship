import makeDataHandler from "./make-data-handler"

export default makeDataHandler("clockInDays", {
    REPLACE_ALL_CLOCK_IN_DAYS: {
        action: "replaceAll"
    },
    FORCE_STAFF_MEMBER_CLOCK_OUT_SUCCESS: {
        action: "update",
        generateActionCreator: false
    },
    UPDATE_STAFF_STATUS_SUCCESS: {
        action: "addOrUpdate"
    }
})
