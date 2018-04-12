import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '~/apps/store';
import reducers from './reducers';
import {initialLoad} from './actions';

import RotaDaily from './container/rota-daily';

class RotaDailyApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(reducers);
    this.store.dispatch(initialLoad({...this.props}));
  }

  render() {
    console.log('props', this.props)
    return (
      <Provider store={this.store}>
        <RotaDaily />
      </Provider>
    )
  }
}

export default RotaDailyApp;
