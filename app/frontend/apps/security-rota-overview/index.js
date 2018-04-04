import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';

import reducers from './redux';
import { loadInitialData } from './redux/actions';
import SecurityRotaOverviewPage from './containers/security-rota-overview-page';

export default class SecurityRotaOverviewApp extends Component {
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
        <SecurityRotaOverviewPage />
      </Provider>
    );
  }
}
