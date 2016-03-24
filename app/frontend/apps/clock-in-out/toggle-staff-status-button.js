import React, {Component} from "react"
import staffStatusOptionsByValue from "~lib/staff-status-options-by-value"

export default class ToggleStaffStatusButton extends Component {
    static propTypes = {
        statusLabels: React.PropTypes.object.isRequired,
        // If `getStatusAfterClicking` returns null the button is not shown
        getStatusAfterClicking: React.PropTypes.func.isRequired,
        staffObject: React.PropTypes.object.isRequired,
        staffStatuses: React.PropTypes.object.isRequired,
        updateStaffStatusWithConfirmation: React.PropTypes.func.isRequired,
        icon: React.PropTypes.string.isRequired
    }
    render(){
        var staffStatus = this.getStaffStatus();
        var nextStatusId = this.props.getStatusAfterClicking(staffStatus);

        if (nextStatusId === null) {
            return null;
        }

        var label = this.props.statusLabels[nextStatusId];

        return <a className="btn btn-default btn-sm" onClick={() => this.onClick()}>
            <span
                className={["glyphicon", "glyphicon-" + this.props.icon].join(" ")}
                style={{display: "inline-block", marginRight: 3}} />
            {label}
        </a>
    }
    getStaffStatus(){
        var staffClientId = this.props.staffObject.clientId;
        return this.props.staffStatuses[staffClientId].status;
    }
    onClick(){
        this.props.updateStaffStatusWithConfirmation({
            staffMemberObject: this.props.staffObject,
            statusValue: this.props.getStatusAfterClicking(this.getStaffStatus())
        });
    }
}