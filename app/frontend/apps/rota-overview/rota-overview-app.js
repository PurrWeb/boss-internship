import React, { Component } from "react"
import RotaOverviewView from "./rota-overview-view"
import * as backendData from "~redux/process-backend-data"

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
                    <a href={"/venues/" + rota.venue.id + "/rotas/" + moment(rota.date).format("DD-MM-YYYY") }>
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
        return <div className="container">
            {overviewViews}
        </div>
        
    }
}
