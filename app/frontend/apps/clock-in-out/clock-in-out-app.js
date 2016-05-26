import React, { Component } from "react"
import { Provider} from "react-redux"
import ClockInOutView from "./clock-in-out-view"
import actionCreators from "~redux/actions"
import AppComponent from "../app-component"

export default class RotaApp extends AppComponent {
    render() {
        return <Provider store={this.store}>
            <ClockInOutView />
        </Provider>
    }
}
