import actionTypes from "../actions/action-types"
import makeReducer, {makeHandlerForGenericReplaceAction} from "./make-reducer"

export default makeReducer({
    GENERIC_REPLACE_ALL_ITEMS: makeHandlerForGenericReplaceAction("clockInDays")
})
