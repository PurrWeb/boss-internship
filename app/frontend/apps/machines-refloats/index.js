import React from "react"
import MachinesRefloats from "./containers/machines-refloats";
import { Provider } from 'react-redux';

import configureStore from '../store';
import reducers from './reducers';
import {initialLoad} from './actions';

export default class MachinesRefloatsApp extends React.Component {

  componentWillMount() {
    this.store = {};
    this.store = configureStore(reducers);
    this.store.dispatch(initialLoad({...this.props}));
  }

  render() {
    return (
      <Provider store={this.store}>
        <MachinesRefloats />
      </Provider>
    )
  }
}
