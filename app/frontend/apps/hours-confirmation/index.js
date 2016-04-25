import React from "react"
import HoursChart from "./components/hours-chart"
import RotaDate from "~lib/rota-date"

import { processBackendObject } from "~lib/backend-data/process-backend-object"

window.hoursAssignments = [];

export default class HoursConfirmationApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            proposedHoursAssignment: null
        }
    }
    render(){
        var events = window.events.map(processBackendObject);
        var intervals = window.intervals.map(processBackendObject);
        var shifts = window.rotaedShifts;
        return <div>
            <HoursChart
                clockedEvents={events}
                clockedIntervals={intervals}
                rotaedShifts={shifts}
                hoursAssignments={window.hoursAssignments}
                proposedHoursAssignment={this.state.proposedHoursAssignment}
                rotaDate={new RotaDate({shiftStartsAt: new Date(2016, 10, 1, 8, 0),})}
                onHoursAssignmentProposed={(proposedHoursAssignment) => {
                    console.log("proposed hours assigmment at ", proposedHoursAssignment)
                    this.setState({proposedHoursAssignment})
                }} />

            {this.getProposedHoursAssignmentUi()}
        </div>
    }
    getProposedHoursAssignmentUi(){
        if (this.state.proposedHoursAssignment === null) {
            return null;
        }
        return <button onClick={() => this.confirmProposedHoursAssignment()}>
            Accept proposed
        </button>
    }
    confirmProposedHoursAssignment(){
        var { starts_at, ends_at } = this.state.proposedHoursAssignment;
        window.hoursAssignments.push({
            starts_at,
            ends_at,
            clocked_hours: 10,
            hours: 8,
            notes: "These are some notes"
        })
        this.setState({proposedHoursAssignment: null})
    }
}