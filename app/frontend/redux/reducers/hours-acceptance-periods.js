import makeReducer, {makeHandlerForGenericReplaceAction, makeHandlerForGenericAddAction } from "./make-reducer"

export default makeReducer({
    REPLACE_ALL_HOURS_ACCEPTANCE_PERIODS: makeHandlerForGenericReplaceAction("hoursAcceptancePeriods"),
    ADD_HOURS_ACCEPTANCE_PERIOD: makeHandlerForGenericAddAction("hoursAcceptancePeriod")
})
