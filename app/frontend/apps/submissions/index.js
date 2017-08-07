import React from 'react';
import { bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import axios from 'axios';

import Dashboard from './components/dashboard';
import MainContent from './components/main-content';
import SubmissionsFilter from './components/submissions-filter';
import SubmissionsList from './components/submissions-list';
import BossDetailsModal from '~/components/boss-details-modal';
import ModalDetailsContent from './components/modal-details-content';
import setInitial from './actions/initial-load';
import Submissions from './containers/submissions';
import configureStore from './store';

const store = configureStore();

class SubmissionsApp extends React.Component {
  constructor(props) {
    super(props);
    store.dispatch(setInitial({...props}));
  }
  
  render() {
    return (
      <Provider store={store}>
        <Submissions />
      </Provider>
    )
  }
}

export default SubmissionsApp
