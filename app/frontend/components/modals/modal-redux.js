import React from 'react';
import { Provider } from "react-redux"
import configureStore from '~/apps/store';

export default function modalRedux(reducers) {
  return function(Component) {
    return class extends React.Component {
      componentDidMount = () => {
        this.store = configureStore(reducers);
      }

      render() {
        return (
          <Provider store={this.store}>
            <Component {...this.props}/>
          </Provider>
        )
      }
    }
  }
}
