import React, { Component } from "react"
import { Provider} from "react-redux"
import ClockInOutView from "./clock-in-out-view.js"
import * as actionCreators from "~redux/actions.js"
import AppComponent from "../app-component"

export default class RotaApp extends AppComponent {
    componentWillMount(){
        this.store.dispatch(actionCreators.loadInitialClockInOutAppState(this.getViewData()))
    }
    render() {
        return <Provider store={this.store}>
            <ClockInOutView />
        </Provider>
    }
}