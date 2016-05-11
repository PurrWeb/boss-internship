import React from "react"
import AppComponent from "../app-component"
import HoursConfirmationView from "./hours-confirmation-view"
import { Provider } from "react-redux"
import {loadInitialHoursConfirmationAppState} from "~redux/actions"

export default class HoursConfirmationApp extends AppComponent {
    componentWillMount(){
        var viewData = this.getViewData();
        this.store.dispatch(loadInitialHoursConfirmationAppState(viewData))
    }
    render(){
        return <Provider store={this.store}>
            <HoursConfirmationView />
        </Provider>
    }
}
