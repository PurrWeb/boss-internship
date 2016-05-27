import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"
import _ from "underscore"
import {batch, batching} from "redux-batch-middleware"
import utils from "~lib/utils"

import actionCreators, * as REQUIRED_TO_BE_LOADED_BEFORE_LOADING_REDUCERS from "~redux/actions"

import clockInStatuses from "./reducers/clock-in-statuses"
import rotaShifts from "./reducers/rota-shifts-reducer"
import clockInOutAppUserMode from "./reducers/clock-in-out-app-user-mode"
import clockInOutAppSelectedStaffType from "./reducers/clock-in-out-app-selected-staff-type-reducer"
import apiRequestsInProgress from "./reducers/api-requests-in-progress-reducer"
import componentErrors from "./reducers/component-errors-reducer"
import rotas from "./reducers/rotas-reducer"
import hoursAcceptancePeriods from "./reducers/hours-acceptance-periods"
import pageOptions from "./reducers/page-options-reducer"
import rotaForecasts from "./reducers/rota-forecasts-reducer"
import weeklyRotaForecast from "./reducers/weekly-rota-forecast-reducer"
import confirmationModal from "./reducers/confirmation-modal-reducer"
import userActionConfirmationMessages from "./reducers/user-action-confirmation-messages-reducer"
import hoursAcceptanceBreaks from "./reducers/hours-acceptance-breaks"
import clockInDays from "./reducers/clock-in-days-reducer"
import apiKey from "./reducers/api-key"
import {makeDefaultDataHandler, validateReducers} from "./reducers/make-data-handler"

var rootReducer = combineReducers({
    staff: makeDefaultDataHandler("staffMembers"),
    rotaShifts,
    clockInStatuses,
    clockInOutAppUserMode,
    clockInOutAppSelectedStaffType,
    apiRequestsInProgress,
    componentErrors,
    venues: makeDefaultDataHandler("venues"),
    rotas,
    pageOptions,
    staffTypes: makeDefaultDataHandler("staffTypes"),
    holidays: makeDefaultDataHandler("holidays"),
    rotaForecasts,
    weeklyRotaForecast,
    confirmationModal,
    userActionConfirmationMessages,
    apiKey,
    clockInDays,
    clockInPeriods: makeDefaultDataHandler("clockInPeriods"),
    clockInBreaks: makeDefaultDataHandler("clockInBreaks"),
    hoursAcceptanceBreaks,
    hoursAcceptancePeriods,
    clockInEvents: makeDefaultDataHandler("clockInEvents"),
    clockInNotes: makeDefaultDataHandler("clockInNotes"),
    clockInReasons: makeDefaultDataHandler("clockInReasons")
});

validateReducers();
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
