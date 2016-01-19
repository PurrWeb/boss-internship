import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk"
import _ from "underscore"

import staffStatuses from "./staff-statuses-reducer"
import staff from "./staff-members-reducer"
import rotaShifts from "./rota-shifts-reducer"
import appIsInManagerMode from "./app-is-in-manager-mode-reducer"
import apiRequestsInProgress from "./api-requests-in-progress-reducer"
import componentErrors from "./component-errors-reducer"

var rootReducer = combineReducers({
    staff,
    rotaShifts,
    staffStatuses,
    appIsInManagerMode,
    apiRequestsInProgress,
    componentErrors
});
var createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
var store = createStoreWithMiddleware(rootReducer);

export default store;
