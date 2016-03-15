import React, { Component } from 'react'
import { Provider} from "react-redux"
import { createBossStore } from '~redux/store.js'
import StaffTypeRotaView from './staff-type-rota-view.js'
import * as actionCreators from "~redux/actions.js"

export default class StaffTypeRotaApp extends Component {
    constructor(props){
        super(props);
        this.store = createBossStore();
    }
    componentWillMount(){
        let viewData = window.boss;
        this.store.dispatch(actionCreators.loadInitalStaffTypeRotaAppState(viewData));
    }
    render() {
        return <Provider store={this.store}>
            <StaffTypeRotaView />
        </Provider>
    }
}
