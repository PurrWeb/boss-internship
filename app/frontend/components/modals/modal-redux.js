import React from 'react';
import { Provider } from "react-redux"
import configureStore from '~/apps/store';

export default function modalRedux(reducers) {
  const store = configureStore(reducers);
  return function(Component) {
    return class extends React.Component {
      render() {
        return (
          <Provider store={store}>
            <Component {...this.props}/>
          </Provider>
        )
      }
    }
  }
}
