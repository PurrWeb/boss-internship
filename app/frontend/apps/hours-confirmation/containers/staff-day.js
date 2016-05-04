import React from "react"
import StaffDayUi from "../components/staff-day"


import HoursChart from "../components/hours-chart"
import RotaDate from "~lib/rota-date"

import { processBackendObject } from "~lib/backend-data/process-backend-object"

window.hoursAssignments = [];

export default class StaffDay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            proposedInfo: [
                {
                    clockInHours: {
                        starts_at: new Date(2016, 10, 1, 10, 0),
                        ends_at: new Date(2016, 10, 1, 18, 0),
                        breaks: [
                            {
                                starts_at: new Date(2016, 10, 1, 11, 30),
                                ends_at: new Date(2016, 10, 1, 12, 30)
                            }
                        ]
                    },
                    reason_id: "912",
                    reason_text: "something happened",
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
            ],
            rotaedShifts: [
                {
                    starts_at: new Date(2016, 10, 1, 10,0),
                    ends_at: new Date(2016, 10, 1, 16, 0)
                }
            ],
            dateOfRota: new Date(2016,10,1,0,0),
            predefinedReasons: [
                {
                    id: "55",
                    title: "Came in late"
                },
                {
                    id: "599",
                    title: "Came in early"
                },
                {
                    id: "912",
                    title: "Other"
                }
            ]
        }


        return <StaffDayUi
            rotaDate={new RotaDate({
                dateOfRota: props.dateOfRota
            })}
            clockedClockIns={props.clockedClockIns}
            rotaedShifts={props.rotaedShifts}
            acceptedHours={this.state.proposedInfo}
            onAcceptedHoursChanged={(acceptedHours) =>{
                this.setState({proposedInfo: acceptedHours})
            }}
            predefinedReasons={props.predefinedReasons}
        />
    }
}
