import React from "react"
import { Provider} from "react-redux"
import store from "~redux/store.js"
import RotaOverviewPage from "./rota-overview-page.js"
import * as actionCreators from "~redux/actions.js"

export default class RotaApp extends React.Component {
    componentWillMount(){
        let viewData = window.boss.rotas;
        store.dispatch(actionCreators.loadInitialRotaOverviewAppState(viewData));
    }
    render() {
        return <Provider store={store}>
            <RotaOverviewPage rotaDetailsObjects={this.getRotaDetailsObjects()} />
        </Provider>
    }
    getRotaDetailsObjects(){
        return window.boss.rotas;
    }
}
