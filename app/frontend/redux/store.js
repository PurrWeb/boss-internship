import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"
import _ from "underscore"
import {batch, batching} from "redux-batch-middleware"
import makeReducer, {makeHandlerForGenericReplaceAction} from "./make-reducer"


import staffStatuses from "./staff-statuses-reducer"
import rotaShifts from "./rota-shifts-reducer"
import clockInOutAppUserMode from "./clock-in-out-app-user-mode"
import clockInOutAppSelectedStaffType from "./clock-in-out-app-selected-staff-type-reducer"
import apiRequestsInProgress from "./api-requests-in-progress-reducer"
import componentErrors from "./component-errors-reducer"
import rotas from "./rotas-reducer"
import pageOptions from "./page-options-reducer"
import rotaForecasts from "./rota-forecasts-reducer"
import weeklyRotaForecast from "./weekly-rota-forecast-reducer"
import confirmationModal from "./confirmation-modal-reducer"
import userActionConfirmationMessages from "./user-action-confirmation-messages-reducer"
import clockInDays from "./clock-in-days-reducer"
import apiKey from "./api-key"

function makeDefaultReducer(propertyName){
    // simple reducer for data that isn't updated after initial load
    return makeReducer({
        GENERIC_REPLACE_ALL_ITEMS: makeHandlerForGenericReplaceAction(propertyName)
    })
}

var rootReducer = combineReducers({
    staff: makeDefaultReducer("staffMembers"),
    rotaShifts,
    staffStatuses,
    clockInOutAppUserMode,
    clockInOutAppSelectedStaffType,
    apiRequestsInProgress,
    componentErrors,
    venues: makeDefaultReducer("venues"),
    rotas,
    pageOptions,
    staffTypes: makeDefaultReducer("staffTypes"),
    holidays: makeDefaultReducer("holidays"),
    rotaForecasts,
    weeklyRotaForecast,
    confirmationModal,
    userActionConfirmationMessages,
    apiKey,
    clockInDays
});
var createStoreWithMiddleware = compose(
	// Redux thunk lets us dispatch asynchronous actions, for example
	// actions that do an Ajax call before updating the state
	// by dispatching another action
	applyMiddleware(thunk),
	// Batch middleware lets us dispatch multiple actions at once:
	// dispatch([a,b]) instead of dispatch(a);dispatch(b);
	// Store subscribers will only be notified once instead of twice.
	applyMiddleware(batch),
    // If available, connect to Redux DevTools
    window.devToolsExtension ? window.devToolsExtension() : f => f

)(createStore);

export function createBossStore(){
    var store = createStoreWithMiddleware(batching(rootReducer));
    window.debug = window.debug || {};
    window.debug.store = store;
    return store;
}
