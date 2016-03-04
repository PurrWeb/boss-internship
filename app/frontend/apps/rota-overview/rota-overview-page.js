import React, { Component } from "react"
import RotaOverviewView from "./rota-overview-view"
import * as backendData from "~redux/process-backend-data"
import {appRoutes} from "~lib/routes"
import {connect} from "react-redux"
import moment from "moment"
import _ from "underscore"
import utils from "~lib/utils"
import rotaStatusTitles from "~lib/rota-status-titles"
import { selectStaffTypesWithShifts } from "~redux/selectors"
import PublishRotaWeekButtonContainer from "./publish-rota-week-button-container"
import WeekAndVenueSelector from "~components/week-and-venue-selector"
import WeeklyRotaForecast from "./containers/weekly-rota-forecast"

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
                <div className="col-md-6">
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
                <div className="col-md-3">

                </div>
                <div className="col-md-3">
                    <h2 style={{fontSize: 20, marginTop: 0}}>Weekly Forecast</h2>
                    <WeeklyRotaForecast
                        venueId={firstRota.venue.id}
                        startOfWeek={utils.getWeekStartDate(firstRota.date)} />
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
        return _.values(this.props.storeRotas).map(function(storeRota){
            var rotaDetails = _.find(self.props.rotaDetailsObjects, function(obj){
                var venuesAreEqual = obj.rota.venue.id === storeRota.venue.id;
                var datesAreEqual = utils.datesAreEqual(new Date(obj.rota.date), storeRota.date);
                return venuesAreEqual && datesAreEqual;
            });

            var staff = rotaDetails.staff_members;
            var shifts = rotaDetails.rota_shifts.map(backendData.processShiftObject);
            var staffTypes = rotaDetails.staff_types;

            var staffTypesWithShifts = selectStaffTypesWithShifts({
                staffTypes: indexById(staffTypes),
                rotaShifts: indexById(shifts),
                staff: indexById(staff)
            });

            return <div key={ storeRota.clientId }>
                <h2>
                    <a href={appRoutes.rota({venueId: storeRota.venue.id, date: storeRota.date}) }>
                        {moment(storeRota.date).format("ddd D MMMM YYYY")}
                    </a>
                    <span className="boss-badge" style={{verticalAlign: "middle", marginLeft: 10}}>
                        {rotaStatusTitles[storeRota.status]}
                    </span>
                </h2>
                <RotaOverviewView
                    staff={ indexById(staff) }
                    shifts={ indexById(shifts) }
                    rota={storeRota}
                    dateOfRota={ storeRota.date }
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