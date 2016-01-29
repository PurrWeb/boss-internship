import React, { Component } from "react"
import RotaOverviewView from "./rota-overview-view"
import * as backendData from "~redux/process-backend-data"
import WeekPicker from "~components/week-picker"
import utils from "~lib/utils"

function indexById(data){
    return _.indexBy(data, "id")
}

export default class RotaApp extends Component {
    render() {
        var overviewViews = window.boss.rotas.map(function(rotaDetails){
            var staff = rotaDetails.staff_members;
            var shifts = rotaDetails.rota_shifts.map(backendData.processShiftObject);
            var rota = backendData.processRotaObject(rotaDetails.rota);
            var staffTypes = rotaDetails.staff_types;

            return <div>
                <h2>
                    <a href={"/venues/" + rota.venue.id + "/rotas/" + utils.formatRotaUrlDate(rota.date) }>
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
        return <div className="container">
            <WeekPicker
                selectionStartDate={firstRota.date}
                onChange={(selection) => {
                    location.href = [
                        "/rotas/?venue_id=" + firstRota.venue.id,
                        "&start_date=" + utils.formatRotaUrlDate(selection.startDate),
                        "&end_date=" + utils.formatRotaUrlDate(selection.endDate)
                    ].join("")

                } }/>
            <br/>
            {overviewViews}
        </div>
        
    }
}
