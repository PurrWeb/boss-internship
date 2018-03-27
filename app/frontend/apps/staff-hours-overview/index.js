import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';

import reducers from '../hours-confirmation/redux';
import { loadInitialData } from '../hours-confirmation/redux/actions';
import HoursConfirmationContainer from '../hours-confirmation/containers/hours-confirmation-container';

export default class HoursConfirmationApp extends Component {
  componentWillMount() {
    const { accessToken } = this.props;
    if (!accessToken) {
      throw new Error('Access token must be present');
    }
    window.boss.accessToken = accessToken;
    this.store = configureStore(reducers);
    this.store.dispatch(loadInitialData(this.props));
  }

  render() {
    return (
      <Provider store={this.store}>
        <HoursConfirmationContainer />
      </Provider>
    );
  }
}
