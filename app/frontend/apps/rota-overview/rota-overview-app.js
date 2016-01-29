import React, { Component } from "react"
import { Provider} from "react-redux"
import store from "~redux/store.js"
import RotaOverviewView from "./rota-overview-view"

export default class RotaApp extends Component {
    componentWillMount(){

    }
    render() {
        return <Provider store={store}>
            <RotaOverviewView />
        </Provider>
    }
}
