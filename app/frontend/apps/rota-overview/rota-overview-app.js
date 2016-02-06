import React, { Component } from "react"
import RotaOverviewView from "./rota-overview-view"
import * as backendData from "~redux/process-backend-data"
import WeekPicker from "~components/week-picker"
import VenueDropdown from "~components/venue-dropdown"
import {appRoutes} from "~lib/routes"

function indexById(data){
    return _.indexBy(data, "id")
}

export default class RotaOverviewApp extends Component {
    render() {
        var overviewViews = window.boss.rotas.map(function(rotaDetails){
            var staff = rotaDetails.staff_members;
            var shifts = rotaDetails.rota_shifts.map(backendData.processShiftObject);
            var rota = backendData.processRotaObject(rotaDetails.rota);
            var staffTypes = rotaDetails.staff_types;
            
            return <div key={ rota.id }>
                <h2>
                    <a href={appRoutes.rota({venueId: rota.venue.id, date: rota.date}) }>
                        {moment(rota.date).format("ddd D MMMM YYYY")}
                    </a>
                </h2>
                <RotaOverviewView
                    staff={ indexById(staff) }
                    shifts={ indexById(shifts) }
                    dateOfRota={ rota.date }
                    staffTypes={ indexById(staffTypes)} />
            </div>
        });

        var firstRota = backendData.processRotaObject(window.boss.rotas[0].rota);
        var lastRota = backendData.processRotaObject(_.last(window.boss.rotas).rota);
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
            </div>
            <br/>
            {overviewViews}
        </div>
    }
    goToOverviewPage(startDate, endDate, venueId){
        location.href = appRoutes.rotaOverview({
            venueId,
            startDate,
            endDate
        });
    }
}
