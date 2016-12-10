import React from "react"

export default class LeaveManagerModeButton extends React.Component {
    static propTypes = {
        leaveManagerModeInProgress: React.PropTypes.bool.isRequired
    }
    render(){
        if (this.props.leaveManagerModeInProgress) {
            return <Spinner />
        }

        var leaveManagerModeButtonText;
        return <a
            className="header__leave-manager-mode-text"
            onClick={() => this.props.leaveManagerMode()}>
            Leave Manager Mode
        </a>
    }
}
