import React from 'react';
import axios from 'axios';
import oFetch from 'o-fetch';

import { bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import configureStore from './store';
import setInitialData from './actions/initial-load';
import CheckLists from './containers/checklists-app';

const store = configureStore();

class CheckListsApp extends React.Component {
  constructor(props) {
    super(props);
    const accessToken = oFetch(props, 'accessToken');
    const currentVenue = oFetch(props, 'currentVenue');
    const checklists = oFetch(props, 'checklists');
    const venues = oFetch(props, 'venues');

    store.dispatch(setInitialData({accessToken, currentVenue, checklists, venues}));
  }

  render() {
    const hasAccessToChecklistSubmissionsPage = oFetch(this.props, 'hasAccessToChecklistSubmissionsPage');

    return (
      <Provider store={store}>
        <CheckLists hasAccessToChecklistSubmissionsPage={hasAccessToChecklistSubmissionsPage} />
      </Provider>
    )
  }
}

export default CheckListsApp;
