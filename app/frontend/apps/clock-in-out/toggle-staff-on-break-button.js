import React, {Component} from "react"
import ToggleStaffStatusButton from "./toggle-staff-status-button"

export default class ToggleStaffOnBreakButton extends Component {
    render(){
        return <div>
        <ToggleStaffStatusButton
            staffObject={this.props.staffObject}
            staffStatuses={this.props.staffStatuses}
            updateStaffStatusWithConfirmation={this.props.updateStaffStatusWithConfirmation}
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