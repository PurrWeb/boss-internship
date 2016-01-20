import React, {Component} from "react"

export default class ToggleStaffStatusButton extends Component {
    static propTypes = {
        statusLabels: React.PropTypes.object.isRequired,
        // If `getStatusAfterClicking` returns null the button is not shown
        getStatusAfterClicking: React.PropTypes.func.isRequired,
        staffId: React.PropTypes.number.isRequired
    }
    static contextTypes = {
        staffStatuses: React.PropTypes.object.isRequired,
        boundActionCreators: React.PropTypes.object.isRequired,
        staffStatusOptions: React.PropTypes.object.isRequired
    }
    render(){
        var staffStatus = this.getStaffStatus();
        var nextStatusId = this.props.getStatusAfterClicking(this.getStaffStatus());

        if (nextStatusId === null) {
            return null;
        }

        var label = this.props.statusLabels[nextStatusId]

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
    onClick(){
        this.context.boundActionCreators.updateStaffStatus(
            this.props.staffId,
            this.props.getStatusAfterClicking(this.getStaffStatus())
        );
    }
}