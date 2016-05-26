import makeReducer, {makeHandlerForGenericReplaceAction, makeHandlerForGenericAddAction } from "./make-reducer"
import _ from "underscore"

export default makeReducer({
    REPLACE_ALL_HOURS_ACCEPTANCE_PERIODS: makeHandlerForGenericReplaceAction("hoursAcceptancePeriods"),
    ADD_HOURS_ACCEPTANCE_PERIOD: makeHandlerForGenericAddAction("hoursAcceptancePeriod"),
    DELETE_HOURS_ACCEPTANCE_PERIOD_SUCCESS: function(state, action){
        return _(state).reject(function(hoursAcceptancePeriod){
            return hoursAcceptancePeriod.clientId === action.hoursAcceptancePeriod.clientId;
        })
    }
})
