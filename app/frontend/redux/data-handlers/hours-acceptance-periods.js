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
    ACCEPT_HOURS_ACCEPTANCE_PERIOD_SUCCESS: function(state, action){
        state = _(state).omit(function(hoursAcceptancePeriod){
            return hoursAcceptancePeriod.clientId == action.oldHoursAcceptancePeriod.clientId;
        });
        var {newHoursAcceptancePeriod} = action;
        state[newHoursAcceptancePeriod.clientId] = newHoursAcceptancePeriod;
        return state;
    },
    UNACCEPT_HOURS_ACCEPTANCE_PERIOD_SUCCESS: {
        action: "update",
        generateActionCreator: false
    },
    FORCE_STAFF_MEMBER_CLOCK_OUT_SUCCESS: {
        action: "add",
        generateActionCreator: false,
        shouldIgnoreAction: function(action){
            return action.hoursAcceptancePeriod === null;
        }
    }
})
