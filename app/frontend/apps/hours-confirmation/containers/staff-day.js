import React from "react"
import StaffDayUi from "../components/staff-day"


import HoursChart from "../components/hours-chart"
import RotaDate from "~lib/rota-date"

import { processBackendObject } from "~lib/backend-data/process-backend-object"

window.hoursAssignments = [];

var events = window.events.map(processBackendObject);
var intervals = window.intervals.map(processBackendObject);
var shifts = window.rotaedShifts;

export default class StaffDay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            proposedInfo: [
                {
                    clockInHours: {
                        starts_at: new Date(2016, 10, 1, 9, 0),
                        ends_at: new Date(2016, 10, 1, 18, 0),
                        breaks: [
                            {
                                starts_at: new Date(2016, 10, 1, 10, 30),
                                ends_at: new Date(2016, 10, 1, 11, 30)
                            }
                        ]
                    },
                    reasonId: 44,
                    reasonText: "something happened",
                    acceptanceStatus: "in_progress"
                }
            ]
        }
        // prop data: 
        // notes
        // clocked clockins
        // predefinedReasons
    }
    render(){
        var props = {
            events: window.events.map(processBackendObject),
            clockedClockIns: [
                {
                    starts_at: new Date(2016, 10, 1, 9, 0),
                    ends_at: new Date(2016, 10, 1, 18, 0),
                    breaks: [
                        {
                            starts_at: new Date(2016, 10, 1, 10, 30),
                            ends_at: new Date(2016, 10, 1, 11, 30)
                        }
                    ]
                }
            ]
        }
        return <StaffDayUi />
    }
}

