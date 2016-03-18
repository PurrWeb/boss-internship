import React from "react"
import AppComponent from "../app-component";
import { Provider} from "react-redux"
import RotaOverviewPage from "./rota-overview-page.js"
import * as actionCreators from "~redux/actions.js"
import { processVenueRotaOverviewObject } from "~lib/backend-data/process-backend-objects"

export default class RotaApp extends AppComponent {
    componentWillMount(){
        let viewData = this.getViewData();
        this.store.dispatch(actionCreators.loadInitialRotaOverviewAppState(viewData));
    }
    render() {
        var rotaDetailsObjects = this.getViewData().rotas;
        rotaDetailsObjects = rotaDetailsObjects.map(processVenueRotaOverviewObject);

        return <Provider store={this.store}>
            <RotaOverviewPage
                rotaDetailsObjects={rotaDetailsObjects} />
        </Provider>
    }
}
