import React from "react"
import { Provider } from "react-redux"
import URLSearchParams from 'url-search-params';

import { configureStore } from '../configure-store';
import MaintenanceContainer from "./containers/maintenance";
import maintenance from "./reducers/maintenance"
import forms from "./reducers/forms"
import { setInitialData } from './actions/initial-load'

export default class MaintenanceApp extends React.Component {
  componentWillMount = () => {
    const {accessToken} = this.props;

    if (!accessToken) {
      throw new Error('Access token must present');
    }
    window.boss.accessToken = accessToken;
    this.store = configureStore({ maintenance, forms });
    this.store.dispatch(setInitialData(this.props));
  }

  render() {
    const queryString = new URLSearchParams(window.location.search);
    return (
      <Provider store={this.store}>
        <MaintenanceContainer />
      </Provider>
    )
  }
}
