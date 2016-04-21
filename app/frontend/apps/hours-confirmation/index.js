import React from "react"
import HoursChart from "./components/hours-chart"

import { processBackendObject } from "~lib/backend-data/process-backend-object"

export default class HoursConfirmationApp extends React.Component {
    render(){
        var events = window.events.map(processBackendObject);
        var intervals = window.intervals.map(processBackendObject);
        return <div>
            <HoursChart
                clockedEvents={events}
                clockedIntervals={intervals} />
        </div>
    }
}