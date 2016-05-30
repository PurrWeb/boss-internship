import makeDataHandler from "./make-data-handler"

export default makeDataHandler("clockInEvents", {
    REPLACE_ALL_CLOCK_IN_EVENTS: {
        action: "replaceAll"
    },
    FORCE_STAFF_MEMBER_CLOCK_OUT_SUCCESS: {
        action: "addOrUpdate",
        generateActionCreator: false
    }
})
