import React, { Component } from 'react'
import { Provider} from "react-redux"
import store from '~redux/store.js'
import StaffTypeRotaView from './staff-type-rota-view.js'
import * as actionCreators from "~redux/actions.js"

export default class StaffTypeRotaApp extends Component {
    componentWillMount(){
        let viewData = window.boss.rota;
        store.dispatch(actionCreators.loadInitialRotaAppState(viewData));
    }
    render() {
        return <Provider store={store}>
            <StaffTypeRotaView />
        </Provider>
    }
}
