import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../store';
import reducers from './reducers';
import {initialLoad} from './actions';

import IncidentReportsIndexPage from './incident-reports-index-page';

class IncidentReportsIndexApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(reducers);
    this.store.dispatch(initialLoad({...this.props}));
  }

  render() {
    return (
      <Provider store={this.store}>
        <IncidentReportsIndexPage />
      </Provider>
    )
  }
}

export default IncidentReportsIndexApp;
