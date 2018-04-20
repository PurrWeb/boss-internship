import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';
import { loadInitialData } from './redux/actions';
import reducers from './redux/reducers';
import SecurityShiftRequestReviewsPage from './containers/security-shift-request-reviews-page';
import oFetch from 'o-fetch';

class SecurityShiftRequestReviewsApp extends Component {
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
        <SecurityShiftRequestReviewsPage />
      </Provider>
    );
  }
}

export default SecurityShiftRequestReviewsApp;
