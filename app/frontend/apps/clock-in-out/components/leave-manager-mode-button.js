import React from "react"

export default class LeaveManagerModeButton extends React.Component {
    static propTypes = {
        userIsManager: React.PropTypes.bool.isRequired,
        userIsSupervisor: React.PropTypes.bool.isRequired,
        leaveManagerModeInProgress: React.PropTypes.bool.isRequired
    }
    render(){
        if (this.props.leaveManagerModeInProgress) {
            return <Spinner />
        }

        var leaveManagerModeButtonText;
        if (this.props.userIsManager){
            leaveManagerModeButtonText = "Leave Manager Mode";
        } else if (this.props.userIsSupervisor) {
            leaveManagerModeButtonText = "Leave Supervisor Mode"
        }
        return <a
            className="btn btn-default show-in-manager-mode"
            onClick={() => this.props.leaveManagerMode()}>
            {leaveManagerModeButtonText}
        </a>
    }
}
