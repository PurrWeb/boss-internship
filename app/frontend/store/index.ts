import {createStore, compose, applyMiddleware, Store} from 'redux';
import {createEpicMiddleware, EpicMiddleware} from 'redux-observable';

import thunk from 'redux-thunk';

import epics from '../epics/index';
import allReducers from '../reducers/index';
import {StoreStructure} from '../interfaces/store-models';

const epicMiddleware: EpicMiddleware<{}, StoreStructure> = createEpicMiddleware(epics);
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [thunk, epicMiddleware];

const store: Store<StoreStructure> = composeEnhancers(
  applyMiddleware(...middleware)
)(createStore)(allReducers);

export default store;
