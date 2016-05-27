import makeDataHandler from "./make-data-handler"
import _ from "underscore"

export default makeDataHandler("hoursAcceptancePeriods", {
    REPLACE_ALL_HOURS_ACCEPTANCE_PERIODS: {
        action: "replaceAll"
    },
    ADD_HOURS_ACCEPTANCE_PERIOD: {
        action: "add"
    },
    DELETE_HOURS_ACCEPTANCE_PERIOD_SUCCESS: {
        action: "delete",
        generateActionCreator: false
    },
    UPDATE_HOURS_ACCEPTANCE_PERIOD: {
        action: "update"
    },
    ACCEPT_HOURS_ACCEPTANCE_PERIOD_SUCCESS: {
        action: "update",
        generateActionCreator: false
    },
    UNACCEPT_HOURS_ACCEPTANCE_PERIOD_SUCCESS: {
        action: "update",
        generateActionCreator: false
    }
})
