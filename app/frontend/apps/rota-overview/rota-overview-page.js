import React, { Component } from "react"
import RotaOverviewView from "./rota-overview-view"
import * as backendData from "~redux/process-backend-data"
import {appRoutes} from "~lib/routes"
import {connect} from "react-redux"
import moment from "moment"
import _ from "underscore"
import rotaStatusTitles from "~lib/rota-status-titles"
import { selectStaffTypesWithShifts } from "~redux/selectors"
import PublishRotaWeekButtonContainer from "./publish-rota-week-button-container"
import WeekAndVenueSelector from "~components/week-and-venue-selector"

function indexById(data){
    return _.indexBy(data, "id")
}

class RotaOverviewPage extends Component {
    static propTypes = {
        rotaDetailsObjects: React.PropTypes.array.isRequired
    }
    render() {
        var overviewViews = this.getOverviewViews();
        
        var rotas = _.values(this.props.storeRotas);
        var firstRota = rotas[0];
        var lastRota = _.last(rotas);
        return <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <WeekAndVenueSelector
                        venueId={firstRota.venue.id}
                        weekStartDate={firstRota.date}
                        venues={indexById(window.boss.venues)}
                        onChange={this.goToOverviewPage.bind(this)}>
                        <br/>
                        <PublishRotaWeekButtonContainer
                            rotas={rotas}
                            firstDate={firstRota.date}
                            lastDate={lastRota.date} />
                    </WeekAndVenueSelector>
                </div>
            </div>
            <br/>
            {overviewViews}
        </div>
    }
    getOverviewViews(){
        var self = this;
        // Use store rotas, because otherwise some rotas won't have an ID/ won't
        // have the same IDs as the store rotas
        return _.values(this.props.storeRotas).map(function(rota, i){
            var rotaDetails = self.props.rotaDetailsObjects[i];
            var staff = rotaDetails.staff_members;
            var shifts = rotaDetails.rota_shifts.map(backendData.processShiftObject);
            var storeRota = self.props.storeRotas[rotaDetails.rota.id];
            var staffTypes = rotaDetails.staff_types;

            var staffTypesWithShifts = selectStaffTypesWithShifts({
                staffTypes: indexById(staffTypes),
                // Items property to simulate how it works in the store
                rotaShifts: indexById(shifts),
                staff: indexById(staff)
            });

            return <div key={ rota.id }>
                <h2>
                    <a href={appRoutes.rota({venueId: rota.venue.id, date: rota.date}) }>
                        {moment(rota.date).format("ddd D MMMM YYYY")}
                    </a>
                    <span className="boss-badge" style={{verticalAlign: "middle", marginLeft: 10}}>
                        {rotaStatusTitles[self.props.storeRotas[rota.id].status]}
                    </span>
                </h2>
                <RotaOverviewView
                    staff={ indexById(staff) }
                    shifts={ indexById(shifts) }
                    rota={rota}
                    dateOfRota={ rota.date }
                    staffTypesWithShifts={ indexById(staffTypesWithShifts)} />
            </div>
        });
    }
    goToOverviewPage({startDate, endDate, venueId}){
        location.href = appRoutes.rotaOverview({
            venueId,
            startDate,
            endDate
        });
    }
}

function mapStateToProps(state){
    return {
        storeRotas: state.rotas
    };
}

export default connect(mapStateToProps)(RotaOverviewPage)