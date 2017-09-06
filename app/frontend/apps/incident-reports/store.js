import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"
import {batch, batching} from "redux-batch-middleware"

export default function configureStore(reducers) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middlewares = [thunk, batch];
  
  const enhancers = [
    applyMiddleware(...middlewares),
  ];
  
  const store = createStore(
    batching(reducers),
    composeEnhancers(...enhancers)
  );

  return store;
}
