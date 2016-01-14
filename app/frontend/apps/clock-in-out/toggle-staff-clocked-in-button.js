import React, {Component} from "react"

export default class ToggleStaffClockedInButton extends Component {
    static contextTypes = {
        staffStatuses: React.PropTypes.object.isRequired,
        boundActionCreators: React.PropTypes.object.isRequired,
        staffStatusOptions: React.PropTypes.object.isRequired
    }
    render(){
        var staffStatus = this.getStaffStatus();
        var nextStatusId = this.getStatusAfterClicking();

        var label = {
            "clocked_in": "Clock In",
            "clocked_out": "Clock Out"
        }[this.getStatusAfterClicking()]

        var style = {
            backgroundColor: this.context.staffStatusOptions[nextStatusId].color
        };

        return <a className="btn btn-status-toggle" style={style} onClick={() => this.onClick()}>
            {label}
        </a>
    }
    getStaffStatus(){
        var staffId = this.props.staffId;
        return this.context.staffStatuses[staffId];
    }
    getStatusAfterClicking(){
        return {
            "clocked_in": "clocked_out",
            "clocked_out": "clocked_in",
            "on_break": "clocked_out"
        }[this.getStaffStatus()];
    }
    onClick(){
        this.context.boundActionCreators.updateStaffStatus(this.props.staffId, this.getStatusAfterClicking());
    }
}