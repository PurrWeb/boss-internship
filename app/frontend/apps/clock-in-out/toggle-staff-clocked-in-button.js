import React, {Component} from "react"
import ToggleStaffStatusButton from "./toggle-staff-status-button"

export default class ToggleStaffClockedInButton extends Component {
    render(){
        return <ToggleStaffStatusButton
            staffObject={this.props.staffObject}
            staffStatuses={this.props.staffStatuses}
            updateStaffStatusWithConfirmation={this.props.updateStaffStatusWithConfirmation}
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