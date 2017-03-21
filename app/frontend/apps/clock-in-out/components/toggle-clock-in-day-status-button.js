import React, {Component} from "react"

export default class ToggleClockInDayStatusButton extends Component {
    static propTypes = {
        statusLabels: React.PropTypes.object.isRequired,
        // If `getStatusAfterClicking` returns null the button is not shown
        getStatusAfterClicking: React.PropTypes.func.isRequired,
        staffObject: React.PropTypes.object.isRequired,
        clockInDay: React.PropTypes.object.isRequired,
        updateClockInStatusWithConfirmation: React.PropTypes.func.isRequired,
        icon: React.PropTypes.string.isRequired
    }
    render(){
        var clockInStatus = this.props.clockInDay.status
        var nextStatusId = this.props.getStatusAfterClicking(clockInStatus);

        if (nextStatusId === null) {
            return null;
        }

        var label = this.props.statusLabels[nextStatusId];

        return <a className="boss-button boss-button_type_small"
            onClick={() => this.onClick()}
            data-test-marker-toggle-staff-status>
            <span
                className={["fa", "fa-"  + this.props.icon].join(" ")}
            /> {label}
        </a>
    }
    onClick(){
        this.props.updateClockInStatusWithConfirmation({
            staffMemberObject: this.props.staffObject,
            statusValue: this.props.getStatusAfterClicking(this.props.clockInDay.status)
        });
    }
}
