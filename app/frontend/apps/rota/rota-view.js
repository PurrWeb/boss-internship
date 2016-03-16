import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import * as actionCreators from "../../redux/actions.js"
import ChartAndFilter from "./chart-and-filter.js"
import _ from "underscore"
import AddShiftViewContainer from "./add-shift-view-container"
import RotaNavigation from "./rota-navigation"
import store from "../../redux/store.js"
import moment from "moment"
import RotaStatusToggle from "./status-toggle/rota-status-toggle"
import { selectRotaOnVenueRotaPage } from "~redux/selectors"
import {appRoutes} from "~lib/routes"


class RotaView extends Component {
    static childContextTypes = {
        staffTypes: React.PropTypes.object,
        boundActionCreators: React.PropTypes.object,
        rotaShifts: React.PropTypes.object,
        dateOfRota: React.PropTypes.instanceOf(Date),
        componentErrors: React.PropTypes.object,
        boundActionCreators: React.PropTypes.object
    }
    getChildContext(){
        return {
            staffTypes: this.props.staffTypes,
            boundActionCreators: this.props.boundActionCreators,
            rotaShifts: this.props.rotaShifts,
            dateOfRota: this.props.dateOfRota,
            componentErrors: this.props.componentErrors
        }
    }
    render() {
        return <div className="container">
            <RotaNavigation
                dateOfRota={this.props.dateOfRota}
                venueServerId={this.props.venue.serverId} />
            <br/>
            <div className="row">
              <div className="col-md-4">
                <RotaStatusToggle />
              </div>
            </div>
            <h1>
                Rota for {this.props.venue.name}: {moment(this.props.dateOfRota).format("ddd D MMMM YYYY")}
            </h1>
            <br/>
            <ChartAndFilter />
            <hr />
            <AddShiftViewContainer 
                dateOfRota={this.props.dateOfRota} />
        </div>
    }
}

function mapStateToProps(state) {
    var props = _.clone(state);

    props.shifts = _.values(props.shifts);

    var shiftsBeingAdded = props.apiRequestsInProgress.ADD_SHIFT;

    var rota = selectRotaOnVenueRotaPage(props);
    props.venue = rota.venue.get(props.venues);
    props.dateOfRota = rota.date;

    return props;
}

export default connect(
    mapStateToProps,
    null, null, {pure: false}
)(RotaView);
