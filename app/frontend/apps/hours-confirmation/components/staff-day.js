import React from "react"
import HoursChart from "./hours-chart"

export default class StaffDay extends React.Component {
    render(){
        return <div>
            staff day component
            <HoursChart
                rotaDate={this.props.rotaDate}
                rotaedShifts={this.props.rotaedShifts}
                proposedAcceptedClockIns={this.props.proposedAcceptedClockIns}
                clockedClockIns={this.props.clockedClockIns}/>
        </div>
    }
}
