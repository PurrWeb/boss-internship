import React, {Component} from "react"
import ToggleClockInDayStatusButton from "./toggle-clock-in-day-status-button"

export default class ToggleStaffClockedInButton extends Component {
    render(){
        return <ToggleClockInDayStatusButton
            staffObject={this.props.staffObject}
            clockInDay={this.props.clockInDay}
            updateClockInStatusWithConfirmation={this.props.updateClockInStatusWithConfirmation}
            icon={"time"}
            statusLabels={{
                "clocked_in": "Clock In",
                "clocked_out": "Clock Out"
            }}
            getStatusAfterClicking={function(currentStatus){
                return {
                    "clocked_in": "clocked_out",
                    "clocked_out": "clocked_in",
                    "on_break": null
                }[currentStatus];
            } } />;
    }
}
