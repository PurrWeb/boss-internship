import React, {Component} from "react"

export default class ToggleStaffClockedInButton extends Component {
    static contextTypes = {
        staffStatuses: React.PropTypes.object.isRequired,
        boundActionCreators: React.PropTypes.object.isRequired
    }
    render(){
        var staffStatus = this.getStaffStatus();
        var nextStatusId = this.getStatusAfterClicking();
        var style = {};

        var label = {
            "clocked_in": "Clock In",
            "clocked_out": "Clock Out"
        }[this.getStatusAfterClicking()]

        return <a className="btn btn-default" style={style} onClick={() => this.onClick()}>
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
        alert("Todo")
    }
}