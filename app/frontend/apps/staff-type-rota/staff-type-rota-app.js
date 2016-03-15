import React, { Component } from 'react'
import { Provider} from "react-redux"
import AppComponent from "../app-component"
import StaffTypeRotaView from './staff-type-rota-view.js'
import * as actionCreators from "~redux/actions.js"

export default class StaffTypeRotaApp extends AppComponent {
    componentWillMount(){
        let viewData = this.getViewData();
        this.store.dispatch(actionCreators.loadInitalStaffTypeRotaAppState(viewData));
    }
    render() {
        return <Provider store={this.store}>
            <StaffTypeRotaView />
        </Provider>
    }
}
