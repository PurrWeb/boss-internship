import React, { Component } from "react"
import { Provider} from "react-redux"
import RotaView from "./rota-view.js"
import * as actionCreators from "~redux/actions.js"
import { bindActionCreators } from "redux";
import AppComponent from "../app-component"

export default class RotaApp extends AppComponent {
    componentWillMount(){
        var viewData = this.getViewData();
        this.boundActionCreators = bindActionCreators(actionCreators, this.store.dispatch.bind(this.store));
        this.store.dispatch(actionCreators.loadInitialRotaAppState(viewData));
    }
    render() {
        return <Provider store={this.store}>
            <RotaView boundActionCreators={this.boundActionCreators} />
        </Provider>
    }
}
