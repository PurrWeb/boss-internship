import makeDataHandler from "./make-data-handler"

export default makeDataHandler("clockInPeriods", {
    REPLACE_ALL_CLOCK_IN_PERIODS: {
        action: "replaceAll"
    },
    FORCE_STAFF_MEMBER_CLOCK_OUT_SUCCESS: {
        action: "addOrUpdate",
        generateActionCreator: false
    }
})
