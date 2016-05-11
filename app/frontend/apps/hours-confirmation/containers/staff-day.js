import React from "react"
import StaffDayUi from "../components/staff-day"
import { connect } from "react-redux"
import RotaDate from "~lib/rota-date"

class StaffDay extends React.Component {
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
        var props = this.props;

        var staffMember = props.staffMember;

        return <StaffDayUi
            markedAsDone={this.state.markedAsDone}
            rotaDate={new RotaDate({
                dateOfRota: props.clockInDay.date
            })}
            clockedClockIns={props.clockedClockIns}
            rotaedShifts={props.rotaedShifts}
            acceptedHours={this.state.proposedInfo}
            onAcceptedHoursChanged={(acceptedHours) =>{
                this.setState({proposedInfo: acceptedHours})
            }}
            markDayAsDone={() => this.setState({markedAsDone: true})}
            events={props.events}
            staffMember={staffMember}
            predefinedReasons={props.predefinedReasons}
            notes={props.notes}
            staffType={this.props.staffType}
        />
    }
}

var hardCodedProps = {
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
    notes: [{
        text: "came in late",
    },{
        text: "extra work from 8pm to midnight",
    }]
}

function mapStateToProps(state, ownProps){
    var staffMember = ownProps.clockInDay.staff_member.get(state.staff);
    var props = {
        staffMember,
        staffType: staffMember.staff_type.get(state.staffTypes)
    }
    return Object.assign(props, hardCodedProps);
}

export default connect(mapStateToProps)(StaffDay)
