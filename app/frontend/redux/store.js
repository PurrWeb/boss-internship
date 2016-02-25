import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"
import _ from "underscore"
import {batch, batching} from "redux-batch-middleware"

import staffStatuses from "./staff-statuses-reducer"
import staff from "./staff-members-reducer"
import rotaShifts from "./rota-shifts-reducer"
import appIsInManagerMode from "./app-is-in-manager-mode-reducer"
import apiRequestsInProgress from "./api-requests-in-progress-reducer"
import componentErrors from "./component-errors-reducer"
import venues from "./venues-reducer"
import rotas from "./rotas-reducer"
import pageOptions from "./page-options-reducer"
import staffTypes from "./staff-types-reducer"
import holidays from "./holidays-reducer"
import rotaForecasts from "./rota-forecasts-reducer"

var rootReducer = combineReducers({
    staff,
    rotaShifts,
    staffStatuses,
    appIsInManagerMode,
    apiRequestsInProgress,
    componentErrors,
    venues,
    rotas,
    pageOptions,
    staffTypes,
    holidays,
    rotaForecasts
});
var createStoreWithMiddleware = compose(
	// Redux thunk lets us dispatch asynchronous actions, for example
	// actions that do an Ajax call before updating the state
	// by dispatching another action
	applyMiddleware(thunk),
	// Batch middleware lets us dispatch multiple actions at once:
	// dispatch([a,b]) instead of dispatch(a);dispatch(b);
	// Store subscribers will only be notified once instead of twice.
	applyMiddleware(batch)
)(createStore);
var store = createStoreWithMiddleware(batching(rootReducer));

export default store;
