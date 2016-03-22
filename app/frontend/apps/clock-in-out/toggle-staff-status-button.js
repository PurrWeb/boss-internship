import React, {Component} from "react"
import staffStatusOptionsByValue from "~lib/staff-status-options-by-value"

export default class ToggleStaffStatusButton extends Component {
    static propTypes = {
        statusLabels: React.PropTypes.object.isRequired,
        // If `getStatusAfterClicking` returns null the button is not shown
        getStatusAfterClicking: React.PropTypes.func.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffStatuses: React.PropTypes.object.isRequired
    }
    render(){
        var staffStatus = this.getStaffStatus();
        var nextStatusId = this.props.getStatusAfterClicking(staffStatus);

        if (nextStatusId === null) {
            return null;
        }

        var label = this.props.statusLabels[nextStatusId]

        var style = {
            backgroundColor: staffStatusOptionsByValue[nextStatusId].color
        };

        return <a className="btn btn-status-toggle" style={style} onClick={() => this.onClick()}>
            {label}
        </a>
    }
    getStaffStatus(){
        var staffClientId = this.props.staffObject.clientId;
        return this.props.staffStatuses[staffClientId].status;
    }
    onClick(){
        this.context.boundActionCreators.updateStaffStatus(
            this.props.staffId,
            this.props.getStatusAfterClicking(this.getStaffStatus())
        );
    }
}