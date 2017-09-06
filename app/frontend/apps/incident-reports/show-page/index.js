import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../store';
import reducers from './reducers';
import {initialLoad} from './actions';

import IncidentReportsShowPage from './containers/incident-reports-show-page';

class IncidentReportsShowApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(reducers);
    this.store.dispatch(initialLoad({...this.props}));
  }

  render() {
    return (
      <Provider store={this.store}>
        <IncidentReportsShowPage />
      </Provider>
    )
  }
}

export default IncidentReportsShowApp;
