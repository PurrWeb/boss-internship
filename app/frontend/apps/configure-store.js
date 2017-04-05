import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

export function configureStore(reducers) {
  const reducer = combineReducers({
    ...reducers
  });

  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify here name, actionsBlacklist, actionsCreators and other options
      }) : compose;

  const enhancer = composeEnhancers(applyMiddleware(thunkMiddleware));
  const store = createStore(reducer, enhancer);

  return store;
}
