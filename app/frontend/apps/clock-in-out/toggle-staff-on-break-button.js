import React, {Component} from "react"
import ToggleClockInDayStatusButton from "./toggle-clock-in-day-status-button"

export default class ToggleStaffOnBreakButton extends Component {
    render(){
        return <div>
        <ToggleClockInDayStatusButton
            staffObject={this.props.staffObject}
            clockInDay={this.props.clockInDay}
            updateClockInStatusWithConfirmation={this.props.updateClockInStatusWithConfirmation}
            icon={"hourglass"}
            statusLabels={{
                "clocked_in": "End break",
                "on_break": "Go On Break",
            }}
            getStatusAfterClicking={function(currentStatus){
                return {
                    "clocked_in": "on_break",
                    "clocked_out": null,
                    "on_break": "clocked_in"
                }[currentStatus];
            } } />
        </div>;
    }
}
