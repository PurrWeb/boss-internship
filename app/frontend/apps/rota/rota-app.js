import React, { Component } from "react"
import { Provider} from "react-redux"
import RotaView from "./rota-view.js"
import actionCreators from "~/redux/actions"
import { bindActionCreators } from "redux";
import AppComponent from "../app-component"

export default class RotaApp extends AppComponent {
    componentWillMount(){
        var viewData = this.getViewData();
        this.store.dispatch(actionCreators.loadInitialRotaAppState(viewData));
    }
    render() {
        return <Provider store={this.store}>
            <RotaView />
        </Provider>
    }
}
