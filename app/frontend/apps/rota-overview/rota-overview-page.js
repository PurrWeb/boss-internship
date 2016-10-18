import React, { Component } from "react"
import RotaOverviewView from "./rota-overview-view"
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

class RotaOverviewPage extends Component {
    static propTypes = {
        rotaDetailsObjects: React.PropTypes.array.isRequired
    }
    render() {
        var overviewViews = this.getOverviewViews();

        var rotas = _.values(this.props.storeRotas);
        var firstRota = rotas[0];
        var lastRota = _.last(rotas);

        var pdfHref = appRoutes.rotaPdfDownload({
            venueId: firstRota.venue.serverId,
            startDate: this.props.startDate,
            endDate: this.props.endDate
        });

        return <div className="container">
            <div className="row">
                <div className="medium-6 column">
                    <WeekAndVenueSelector
                        venueClientId={firstRota.venue.clientId}
                        weekStartDate={firstRota.date}
                        venues={utils.indexByClientId(this.props.venues)}
                        onChange={this.goToOverviewPage.bind(this)}>
                        <br/>
                        <PublishRotaWeekButtonContainer
                            rotas={rotas}
                            firstDate={firstRota.date}
                            lastDate={lastRota.date} />

                    </WeekAndVenueSelector>
                </div>
                <div className="medium-3 column">
                    <a href={pdfHref} className="btn btn-success">
                      <span className="glyphicon glyphicon-download"></span> Download PDF
                    </a>
                </div>
                <div className="medium-3 column">
                    <h2 style={{fontSize: 20, marginTop: 0}}>Weekly Forecast</h2>
                    <WeeklyRotaForecast
                        serverVenueId={firstRota.venue.serverId}
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
                var venuesAreEqual = obj.rota.venue.clientId === storeRota.venue.clientId;
                var datesAreEqual = utils.datesAreEqual(new Date(obj.rota.date), storeRota.date);
                return venuesAreEqual && datesAreEqual;
            });

            var staffTypesWithShifts = selectStaffTypesWithShifts({
                staffTypes: utils.indexByClientId(rotaDetails.staff_types),
                rotaShifts: utils.indexByClientId(rotaDetails.rota_shifts),
                staff: utils.indexByClientId(rotaDetails.staff_members)
            });

            return <div key={ storeRota.clientId }>
                <h2>
                    <a href={appRoutes.rota({venueId: storeRota.venue.serverId, date: storeRota.date}) }>
                        {moment(storeRota.date).format("ddd D MMMM YYYY")}
                    </a>
                    <span className="boss-badge" style={{verticalAlign: "middle", marginLeft: 10}}>
                        {rotaStatusTitles[storeRota.status]}
                    </span>
                </h2>
                <RotaOverviewView
                    staff={ utils.indexByClientId(rotaDetails.staff_members) }
                    shifts={ utils.indexByClientId(rotaDetails.rota_shifts) }
                    rota={storeRota}
                    dateOfRota={ storeRota.date }
                    staffTypesWithShifts={ utils.indexByClientId(staffTypesWithShifts)} />
            </div>
        });
    }
    goToOverviewPage({startDate, endDate, venueClientId}){
        location.href = appRoutes.rotaOverview({
            venueId: this.props.venues[venueClientId].serverId,
            startDate,
            endDate
        });
    }
}

function mapStateToProps(state){
    return {
        storeRotas: state.rotas,
        endDate: state.pageOptions.endDate,
        startDate: state.pageOptions.startDate,
        venues: state.venues
    };
}

export default connect(mapStateToProps)(RotaOverviewPage)
