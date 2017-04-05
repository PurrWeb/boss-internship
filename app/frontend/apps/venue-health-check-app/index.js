import React from "react"
import { Provider } from "react-redux"
import { configureStore } from '../configure-store';

import QuestionnaireContainer from "./containers/questionnaire";
import venueHealthCheck from "./reducers/venue-health-check"

export default class VenueHealthCheckApp extends React.Component {
  render() {
    return (
      <Provider store={ configureStore({ venueHealthCheck }) }>
        <QuestionnaireContainer />
      </Provider>
    )
  }
}
