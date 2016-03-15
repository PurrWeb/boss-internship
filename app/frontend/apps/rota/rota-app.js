import React, { Component } from 'react'
import { Provider} from "react-redux"
import { createBossStore } from '~redux/store.js'
import RotaView from './rota-view.js'
import * as actionCreators from "~redux/actions.js"
import { bindActionCreators } from "redux";

const store = createBossStore();
const boundActionCreators = bindActionCreators(actionCreators, store.dispatch.bind(store));

export default class RotaApp extends Component {
    componentWillMount(){
        var viewData = this.getViewData();
        store.dispatch(actionCreators.loadInitialRotaAppState(viewData));
    }
    render() {
        return <Provider store={store}>
            <RotaView boundActionCreators={boundActionCreators} />
        </Provider>
    }
    getViewData(){
        if (this.props.viewData){
            return this.props.viewData;
        }
        return window.boss;
    }
}
