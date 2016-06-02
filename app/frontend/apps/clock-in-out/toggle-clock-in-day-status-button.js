import React, {Component} from "react"
import staffStatusOptionsByValue from "~lib/staff-status-options-by-value"

export default class ToggleClockInDayStatusButton extends Component {
    static propTypes = {
        statusLabels: React.PropTypes.object.isRequired,
        // If `getStatusAfterClicking` returns null the button is not shown
        getStatusAfterClicking: React.PropTypes.func.isRequired,
        staffObject: React.PropTypes.object.isRequired,
        clockInDay: React.PropTypes.object.isRequired,
        updateStaffStatusWithConfirmation: React.PropTypes.func.isRequired,
        icon: React.PropTypes.string.isRequired
    }
    render(){
        var staffStatus = this.props.clockInDay.status
        var nextStatusId = this.props.getStatusAfterClicking(staffStatus);

        if (nextStatusId === null) {
            return null;
        }

        var label = this.props.statusLabels[nextStatusId];

        return <a className="btn btn-default btn-sm"
            onClick={() => this.onClick()}
            data-test-marker-toggle-staff-status>
            <span
                className={["glyphicon", "glyphicon-" + this.props.icon].join(" ")}
                style={{display: "inline-block", marginRight: 3}} />
            {label}
        </a>
    }
    onClick(){
        this.props.updateStaffStatusWithConfirmation({
            staffMemberObject: this.props.staffObject,
            statusValue: this.props.getStatusAfterClicking(this.props.clockInDay.status)
        });
    }
}
