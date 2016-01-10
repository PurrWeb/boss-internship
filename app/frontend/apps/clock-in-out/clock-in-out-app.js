import React, { Component } from "react"
import { Provider} from "react-redux"
import store from "../../redux/store"
import ClockInOutView from "./clock-in-out-view"
import * as actionCreators from "../../redux/actions"

export default class CheckInOutApp extends Component {
  render() {
    return <Provider store={store}>
      <ClockInOutView />
    </Provider>
  }
}