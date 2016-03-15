import React from "react"
import { Provider} from "react-redux"
import { createBossStore } from "~redux/store.js"
import RotaOverviewPage from "./rota-overview-page.js"
import * as actionCreators from "~redux/actions.js"

const store = createBossStore();

export default class RotaApp extends React.Component {
    componentWillMount(){
        let viewData = this.getViewData();
        store.dispatch(actionCreators.loadInitialRotaOverviewAppState(viewData));
    }
    render() {
        return <Provider store={store}>
            <RotaOverviewPage
                rotaDetailsObjects={this.getViewData().rotas} />
        </Provider>
    }
    getViewData(){
        if (this.props.viewData) {
            return this.props.viewData;
        }
        return window.boss;
    }
}
