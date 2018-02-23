import React from "react"
import { Provider } from "react-redux"
import { configureStore } from '../configure-store';

import MarketingTasksContainer from "./containers/marketing-tasks";
import marketing from "./reducers/marketing";
import forms from "./reducers/forms";
import { reducer as form } from 'redux-form/immutable';

export default class MarketingTasksApp extends React.Component {
  render() {
    return (
      <Provider store={ configureStore({ marketing, form, forms }) }>
        <MarketingTasksContainer />
      </Provider>
    )
  }
}
