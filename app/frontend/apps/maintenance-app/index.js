import React from "react"
import { Provider } from "react-redux"
import { configureStore } from '../configure-store';

import MaintenanceContainer from "./containers/maintenance";
import maintenance from "./reducers/maintenance"
import forms from "./reducers/forms"

export default class MaintenanceApp extends React.Component {
  render() {
    return (
      <Provider store={ configureStore({ maintenance, forms }) }>
        <MaintenanceContainer />
      </Provider>
    )
  }
}
