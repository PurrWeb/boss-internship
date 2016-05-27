import makeReducer, {
    makeHandlerForGenericReplaceAction,
    makeHandlerForGenericAddAction,
    makeHandlerForGenericDeleteAction,
    makeHandlerForGenericUpdateAction
} from "./make-reducer"
import _ from "underscore"

export default makeReducer({
    REPLACE_ALL_HOURS_ACCEPTANCE_PERIODS: makeHandlerForGenericReplaceAction("hoursAcceptancePeriods"),
    ADD_HOURS_ACCEPTANCE_PERIOD: makeHandlerForGenericAddAction("hoursAcceptancePeriods"),
    DELETE_HOURS_ACCEPTANCE_PERIOD_SUCCESS: makeHandlerForGenericDeleteAction("hoursAcceptancePeriods", {
        createDefaultActionCreator: false
    }),
    UPDATE_HOURS_ACCEPTANCE_PERIOD: makeHandlerForGenericUpdateAction("hoursAcceptancePeriods")
})
