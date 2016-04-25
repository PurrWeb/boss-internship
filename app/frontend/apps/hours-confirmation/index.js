import React from "react"
import HoursChart from "./components/hours-chart"
import RotaDate from "~lib/rota-date"

import { processBackendObject } from "~lib/backend-data/process-backend-object"

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
        console.log("state", this.state)
        return <div>
            <HoursChart
                clockedEvents={events}
                clockedIntervals={intervals}
                rotaedShifts={shifts}
                proposedHoursAssignment={this.state.proposedHoursAssignment}
                rotaDate={new RotaDate({shiftStartsAt: new Date(2016, 10, 1, 8, 0),})}
                onHoursAssignmentProposed={(proposedHoursAssignment) => this.setState({proposedHoursAssignment})} />
        </div>
    }
}