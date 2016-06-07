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
                    accepted_state: "in_progress"
                }
            ],
            markedAsDone: false
        }
        // prop data:
        // notes
        // clocked clockins
        // predefinedReasons
    }
    render(){
        var props = {
            events: [{
                id: 11,
                type: "clock_in",
                time: new Date(2016, 10, 1, 9, 0)
            }, {
                id: 22,
                type: "start_break",
                time: new Date(2016, 10, 1, 10, 30)
            }, {
                id: 33,
                type: "end_break",
                time: new Date(2016, 10, 1, 11, 30)
            }, {
                id: 44,
                type: "clock_out",
                time: new Date(2016, 10, 1, 18, 0)
            }, {
                id: 55,
                type: "clock_in",
                time: new Date(2016, 10, 2, 1, 0)
            }, {
                id: 66,
                type: "start_break",
                time: new Date(2016, 10, 2, 2, 30)
            }],
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
                },
                {
                    starts_at: new Date(2016, 10, 2, 1, 0),
                    ends_at: null,
                    breaks: [
                        {
                            starts_at: new Date(2016, 10, 2, 2, 30),
                            ends_at: null
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
            ],
            staffMember: {
                "id": 160,
                "url": "https://boss.jsmbars.co.uk/api/v1/staff_members/160",
                "avatar_url": "https://jsmbars-assets-boss-production.s3.amazonaws.com/uploads/staff_member/avatar/160/avatar.jpg",
                "staff_type": {
                    "id": 8,
                    "url": "https://boss.jsmbars.co.uk/api/v1/staff_types/8"
                },
                "first_name": "Shane",
                "surname": "McEnhill",
                "preferred_hours": "48",
                "preferred_days": "Full time",
                "holidays": [],
                "venues": [{
                    "id": 1,
                    "url": "https://boss.jsmbars.co.uk/api/v1/venues/1"
                }]
            },
            notes: [{
                text: "came in late",
            },{
                text: "extra work from 8pm to midnight",
            }]
        }

        return <StaffDayUi
            markedAsDone={this.state.markedAsDone}
            rotaDate={new RotaDate({
                dateOfRota: props.dateOfRota
            })}
            clockedClockIns={props.clockedClockIns}
            rotaedShifts={props.rotaedShifts}
            acceptedHours={this.state.proposedInfo}
            onAcceptedHoursChanged={(acceptedHours) =>{
                this.setState({proposedInfo: acceptedHours})
            }}
            markDayAsDone={() => this.setState({markedAsDone: true})}
            events={props.events}
            staffMember={props.staffMember}
            predefinedReasons={props.predefinedReasons}
            notes={props.notes}
        />
    }
}