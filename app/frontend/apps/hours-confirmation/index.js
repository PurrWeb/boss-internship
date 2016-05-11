import React from "react"
import AppComponent from "../app-component"
import HoursConfirmationView from "./hours-confirmation-view"
import { Provider } from "react-redux"

export default class HoursConfirmationApp extends AppComponent {
    render(){
        return <Provider store={this.store}>
            <HoursConfirmationView />
        </Provider>
    }
}
