import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fromJS } from 'immutable';
import reducers from './reducers';
import sagas from './sagas';

export default function configureStore(initial) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    reducers,
    fromJS(initial),
    composeEnhancers(...enhancers),
  );

  sagaMiddleware.run(sagas);

  return store;
}
