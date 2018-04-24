import React, { Component } from 'react';
import { Provider } from 'react-redux';
import oFetch from 'o-fetch';
import configureStore from '~/apps/store';
import HolidayRequests from './containers/holiday-requests';
import { loadInitialData } from './redux/actions';
import reducers from './redux/reducers';

class HolidayRequestsApp extends Component {
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
        <HolidayRequests />
      </Provider>
    );
  }
}

export default HolidayRequestsApp;
