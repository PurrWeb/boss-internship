import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';

import reducers from './redux/reducers';
import { loadInitialData } from './redux/actions';
import Page from './containers/page';

import fixtures from './fixtures';

export default class SecurityRotaOverviewApp extends Component {
  componentWillMount() {
    // const { accessToken } = this.props;
    // if (!accessToken) {
    //   throw new Error('Access token must be present');
    // }
    // window.boss.accessToken = accessToken;
    this.store = configureStore(reducers);
    this.store.dispatch(loadInitialData(fixtures));
  }

  render() {
    return (
      <Provider store={this.store}>
        <Page />
      </Provider>
    );
  }
}
