import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"
import vouchersReducer from './reducers';
import {batch, batching} from "redux-batch-middleware"

export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middlewares = [thunk, batch];
  
  const enhancers = [
    applyMiddleware(...middlewares),
  ];
  
  const store = createStore(
    batching(vouchersReducer),
    composeEnhancers(...enhancers)
  );

  return store;
}