import React from "react"
import AppComponent from "../app-component";
import { Provider} from "react-redux"
import RotaOverviewPage from "./rota-overview-page"
import actionCreators from "~/redux/actions"
import { processVenueRotaOverviewObject } from "~/lib/backend-data/process-backend-objects"

export default class RotaApp extends AppComponent {
    componentWillMount(){
        let viewData = this.props;
        this.store.dispatch(actionCreators.loadInitialRotaOverviewAppState(viewData));
    }
    render() {
        var rotaDetailsObject = this.props.rotaWeeklyDay;
        rotaDetailsObject = processVenueRotaOverviewObject(rotaDetailsObject);

        return <Provider store={this.store}>
            <RotaOverviewPage
              rotaDetailsObject={rotaDetailsObject}
              rotaForecast={this.props.rotaForecast}
              venue={this.props.venue}
              venues={this.props.venues}
            />
        </Provider>
    }
}
