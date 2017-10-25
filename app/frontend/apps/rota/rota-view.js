import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import actionCreators from "~/redux/actions"
import ChartAndFilter from "./chart-and-filter"
import _ from "underscore"
import AddShiftViewContainer from "./add-shift-view-container"
import RotaNavigation from "./rota-navigation"
import store from "~/redux/store"
import safeMoment from "~/lib/safe-moment";
import RotaStatusToggle from "./status-toggle/rota-status-toggle"
import { selectRotaOnVenueRotaPage } from "~/redux/selectors"
import {appRoutes} from "~/lib/routes"


class RotaView extends Component {
    render() {
        return <div className="container">
            <RotaNavigation
                dateOfRota={this.props.rota.date}
                venueServerId={this.props.venue.serverId} />
            <br/>
            <div className="row column mb-md">
                <RotaStatusToggle />
            </div>
            <h1 className="mb-md">
                Rota for {this.props.venue.name}: {safeMoment.uiDateParse(this.props.rota.date).format("ddd D MMMM YYYY")}
            </h1>
            <ChartAndFilter />
            <AddShiftViewContainer
                dateOfRota={this.props.rota.date} />
        </div>
    }
}

function mapStateToProps(state) {
    var rota = selectRotaOnVenueRotaPage(state);

    return {
        venue: rota.venue.get(state.venues),
        rota: rota
    }
}

export default connect(
    mapStateToProps,
    null, null, {pure: false}
)(RotaView);
