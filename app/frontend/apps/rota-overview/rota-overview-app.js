import React, { Component } from "react"
import RotaOverviewView from "./rota-overview-view"
import * as backendData from "~redux/process-backend-data"
import WeekPicker from "~components/week-picker"
import VenueDropdown from "~components/venue-dropdown"
import {appRoutes} from "~lib/routes"
import moment from "moment"
import _ from "underscore"
import rotaStatusTitles from "~lib/rota-status-titles"
import { selectStaffTypesWithShifts } from "~redux/selectors"
import PublishRotaWeekButtonContainer from "./publish-rota-week-button-container"

function indexById(data){
    return _.indexBy(data, "id")
}

export default class RotaOverviewApp extends Component {
    render() {
        var overviewViews = this.getOverviewViews();

        var rotas = window.boss.rotas.map(function(rotaDetails){
            return backendData.processRotaObject(rotaDetails.rota)
        });

        var firstRota = rotas[0];
        var lastRota = _.last(rotas);
        return <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <WeekPicker
                        selectionStartDate={firstRota.date}
                        onChange={(selection) => {
                            this.goToOverviewPage(selection.startDate, selection.endDate, firstRota.venue.id)
                        } }/>
                </div>
                <div className="col-md-3">
                    <VenueDropdown
                        venues={window.boss.venues}
                        selectedVenue={firstRota.venue.id}
                        onChange={
                            (venueId) => this.goToOverviewPage(firstRota.date, lastRota.date, venueId)
                        } />
                </div>
                <div className="col-md-3">
                </div>
                <div className="col-md-3">
                    <PublishRotaWeekButtonContainer
                        rotas={rotas}
                        firstDate={firstRota.date}
                        lastDate={lastRota.date} />
                </div>
            </div>
            <br/>
            {overviewViews}
        </div>
    }
    getOverviewViews(){
        return window.boss.rotas.map(function(rotaDetails){
            var staff = rotaDetails.staff_members;
            var shifts = rotaDetails.rota_shifts.map(backendData.processShiftObject);
            var rota = backendData.processRotaObject(rotaDetails.rota);
            var staffTypes = rotaDetails.staff_types;

            var staffTypesWithShifts = selectStaffTypesWithShifts({
                staffTypes: indexById(staffTypes),
                // Items property to simulate how it works in the store
                rotaShifts: {items: indexById(shifts)}, 
                staff: indexById(staff)
            });

            return <div key={ rota.id }>
                <h2>
                    <a href={appRoutes.rota({venueId: rota.venue.id, date: rota.date}) }>
                        {moment(rota.date).format("ddd D MMMM YYYY")}
                    </a>
                    <span className="boss-badge" style={{verticalAlign: "middle", marginLeft: 10}}>
                        {rotaStatusTitles[rota.status]}
                    </span>
                </h2>
                <RotaOverviewView
                    staff={ indexById(staff) }
                    shifts={ indexById(shifts) }
                    dateOfRota={ rota.date }
                    staffTypesWithShifts={ indexById(staffTypesWithShifts)} />
            </div>
        });
    }
    goToOverviewPage(startDate, endDate, venueId){
        location.href = appRoutes.rotaOverview({
            venueId,
            startDate,
            endDate
        });
    }
}
