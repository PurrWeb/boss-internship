import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"
import _ from "underscore"
import {batch, batching} from "redux-batch-middleware"
import utils from "~lib/utils"

import {databaseFactory} from "~redux/actions/database"

var rootReducer = databaseFactory.getRootReducer();

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
	window.rootReducer = rootReducer
    return store;
}
