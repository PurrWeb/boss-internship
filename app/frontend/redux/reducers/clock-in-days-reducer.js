import actionTypes from "../actions/action-types"
import makeReducer, {makeHandlerForGenericReplaceAction} from "./make-reducer"

export default makeReducer({
    "REPLACE_ALL_CLOCK_IN_DAYS": makeHandlerForGenericReplaceAction("clockInDays")
})
