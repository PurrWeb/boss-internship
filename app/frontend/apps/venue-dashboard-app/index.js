import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '../configure-store';

import VenueDashboardContainer from './containers/venue-dashboard';
import venueDashboard from './reducers/venue-dashboard'

export default class VenueDashboardApp extends React.Component {
  render() {
    return (
      <Provider store={ configureStore({ venueDashboard }) }>
        <VenueDashboardContainer />
      </Provider>
    )
  }
}
