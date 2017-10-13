import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../../store';
import reducers from './reducers';
import {initialLoad} from './actions';

import MachinesIndexPage from './containers/machines-index-page';

export default class MachinesIndexApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(reducers);
    this.store.dispatch(initialLoad({...this.props}));
  }

  render() {
    return (
      <Provider store={this.store}>
        <MachinesIndexPage />
      </Provider>
    )
  }
};
