import React from "react"
import { Provider } from "react-redux"
import { configureStore } from '../configure-store';

import venueHealthCheckReport from "./reducers/venue-health-check-report"
import ReportContainer from "./containers/report";

export default class VenueHealthCheckReportApp extends React.Component {
  render() {
    return (
      <Provider store={ configureStore({ venueHealthCheckReport }) }>
        <ReportContainer />
      </Provider>
    )
  }
}
