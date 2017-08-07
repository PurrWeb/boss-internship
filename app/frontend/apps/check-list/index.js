import React from 'react';
import axios from 'axios';

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
    const {
      accessToken,
      currentVenue,
      checklists,
      venues,
    } = props;

    store.dispatch(setInitialData({accessToken, currentVenue, checklists, venues}));
  }
  
  render() {
    return (
      <Provider store={store}>
        <CheckLists />
      </Provider>
    )
  }
}

export default CheckListsApp;
