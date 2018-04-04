import React, { Component } from 'react';
import { Provider } from 'react-redux';
import oFetch from 'o-fetch';
import configureStore from '~/apps/store';
import { setInitialData } from './actions';
import HolidayRequestsUI from './components/holiday-requests-ui';

const store = configureStore();

class HolidayRequestsApp extends Component {
  constructor(props) {
    super(props);
    store.dispatch(setInitialData({
      accessToken: oFetch(props, 'accessToken')
    }));
  }

  render() {
    return <Provider store={store}>
      <HolidayRequestsUI />
    </Provider>;
  }
}

export default HolidayRequestsApp;
