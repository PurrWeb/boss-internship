import {createStore, compose, applyMiddleware, Store} from 'redux';
import {createEpicMiddleware, EpicMiddleware} from 'redux-observable';

import epics from '../../../epics/index';
import allReducers from '../reducers/index';
import {StoreStructure} from '../../../interfaces/store-models';

const epicMiddleware: EpicMiddleware<{}, StoreStructure> = createEpicMiddleware(epics);
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store<StoreStructure> = composeEnhancers(
  applyMiddleware(epicMiddleware)
)(createStore)(allReducers);

/*store.subscribe(() => {
  console.log('store.getState()', store.getState());
});*/

export default store;
