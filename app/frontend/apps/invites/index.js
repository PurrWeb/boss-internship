import React from 'react';
import { Provider } from 'react-redux';
import URLSearchParams from 'url-search-params';

import configureStore from '~/apps/store';
import reducers from './redux/reducers';
import { loadInitialData, setInitialFilters } from './redux/actions';
import { changeQueryString } from './helpers';
import { STATUSES_FILTER, ROLES_FILTER } from './constants';
import Page from './containers/page';

class InvitesApp extends React.Component {
  componentWillMount() {
    const { accessToken } = this.props;
    console.log(this.props)
    if (!accessToken) {
      throw new Error('Access token must be present');
    }
    window.boss.accessToken = accessToken;
    const queryString = new URLSearchParams(window.location.search);

    const statusFromQuery = queryString.get('status') || 'any';
    const roleFromQuery = queryString.get('role') || 'any';
    const status = STATUSES_FILTER.includes(statusFromQuery) ? statusFromQuery : 'any';
    const role = ROLES_FILTER.includes(roleFromQuery) ? roleFromQuery : 'any';
    if (status !== statusFromQuery || role !== roleFromQuery) {
      changeQueryString({ status, role });
    }
    this.store = configureStore(reducers);
    this.store.dispatch(setInitialFilters({ status, role }));
    this.store.dispatch(loadInitialData(this.props));
  }

  render() {
    return (
      <Provider store={this.store}>
        <Page />
      </Provider>
    );
  }
}

export default InvitesApp;
