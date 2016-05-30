import makeDataHandler from "./make-data-handler"
import _ from "underscore"

export default makeDataHandler("hoursAcceptanceBreaks", {
    ADD_HOURS_ACCEPTANCE_BREAK: {action: "add"},
    REPLACE_ALL_HOURS_ACCEPTANCE_BREAKS: {action: "replaceAll"},
    UPDATE_HOURS_ACCEPTANCE_BREAK: {action: "update"},
    DELETE_HOURS_ACCEPTANCE_BREAK: {action: "delete"},
    ACCEPT_HOURS_ACCEPTANCE_PERIOD_SUCCESS: function(state, action){
        state = _(state).omit(function(hoursAcceptanceBreak){
            return hoursAcceptanceBreak.hours_acceptance_period.clientId ===
                action.oldHoursAcceptancePeriod.clientId;
        })

        action.newHoursAcceptanceBreaks.forEach(function(hoursAcceptanceBreak){
            state[hoursAcceptanceBreak.clientId] = hoursAcceptanceBreak;
        })

        return state;
    }
})
