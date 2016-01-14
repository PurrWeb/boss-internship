import React, {Component} from "react"
import ToggleStaffStatusButton from "./toggle-staff-status-button"

export default class ToggleStaffOnBreakButton extends Component {
    render(){
        return <ToggleStaffStatusButton
            staffId={this.props.staffId}
            statusLabels={{
                "clocked_in": "Clock In",
                "on_break": "On Break", 
            }}
            getStatusAfterClicking={function(currentStatus){
                return {
                    "clocked_in": "on_break",
                    "clocked_out": null,
                    "on_break": "clocked_in"
                }[currentStatus];
            } } />;
    }
}