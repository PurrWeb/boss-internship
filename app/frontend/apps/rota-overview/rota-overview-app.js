import React from "react"
import AppComponent from "../app-component";
import { Provider} from "react-redux"
import RotaOverviewPage from "./rota-overview-page"
import actionCreators from "~/redux/actions"

export default class RotaApp extends AppComponent {
    componentWillMount(){
        let viewData = this.props;
        this.store.dispatch(actionCreators().loadInitialRotaOverviewAppState(viewData));
    }
    render() {
        var rotaDetailsObject = this.props.rotaWeeklyDay;
        return <Provider store={this.store}>
            <RotaOverviewPage
              rotaDetailsObject={rotaDetailsObject}
              venue={this.props.venue}
              venues={this.props.venues}
            />
        </Provider>
    }
}
