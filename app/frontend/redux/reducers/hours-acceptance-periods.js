import { makeDefaultReducer } from "./make-reducer"
import _ from "underscore"

export default makeDefaultReducer("hoursAcceptancePeriods", {
    ADD_CLOCK_IN_BREAK: function(state, action){
        return _(state).map(function(hoursAcceptancePeriod){
            if (hoursAcceptancePeriod.clientId === action.clockInBreak.hours_acceptance_period.clientId) {
                var breaks = _.clone(hoursAcceptancePeriod.breaks)
                breaks.push(action.clockInBreak.getLink())
                return Object.assign({}, hoursAcceptancePeriod, {
                    breaks
                })
            };
            return hoursAcceptancePeriod
        })
    }
})
