import React, { Component } from 'react'
import { Provider} from "react-redux"
import AppComponent from "../app-component"
import StaffTypeRotaView from './staff-type-rota-view'
import actionCreators from "~redux/actions"

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
