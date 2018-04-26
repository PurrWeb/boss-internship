import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';

import reducers from './redux/reducers';
import { loadInitialData } from './redux/actions';
import FinanceReportsPage from './containers/page';

export default class FinanceReportsApp extends Component {
  componentWillMount() {
    require('./styles.css');
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
        <FinanceReportsPage />
      </Provider>
    );
  }
}
