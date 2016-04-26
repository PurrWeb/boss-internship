import React from "react"
import HoursChart from "./components/hours-chart"
import RotaDate from "~lib/rota-date"

import { processBackendObject } from "~lib/backend-data/process-backend-object"

window.hoursAssignments = [];

export default class HoursConfirmationApp extends React.Component {
    constructor(props){
        super(props);
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
                rotaDate={new RotaDate({shiftStartsAt: new Date(2016, 10, 1, 8, 0),})} />
        </div>
    }
}