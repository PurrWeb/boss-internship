import React, { Component } from "react"
import { Provider} from "react-redux"
import ClockInOutView from "./containers/clock-in-out-view"
import actionCreators from "~redux/actions"
import AppComponent from "../app-component"

export default class RotaApp extends AppComponent {
    componentWillMount(){
        var store = this.store;
        store.subscribe(function(){
    		localStorage.setItem("clockInOutApiKey", store.getState().apiKey)
    	})

        var localStorageApiKey = localStorage.getItem("clockInOutApiKey")
        if (localStorageApiKey){
            store.dispatch(actionCreators.setApiKeyAndFetchClockInOutAppData(localStorageApiKey))
        }
    }
    render() {
        return <Provider store={this.store}>
            <ClockInOutView />
        </Provider>
    }
}
