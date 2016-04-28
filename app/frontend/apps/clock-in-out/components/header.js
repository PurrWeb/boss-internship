import React from "react"
import moment from "moment"
import LeaveManagerModeButton from "./leave-manager-mode-button"

export default class Header extends React.Component {
    static propTypes = {
        returnToStaffTypeSelector: React.PropTypes.func.isRequired,
        userIsManagerOrSupervisor: React.PropTypes.bool.isRequired,
        userIsManager: React.PropTypes.bool.isRequired,
        userIsSupervisor: React.PropTypes.bool.isRequired,
        leaveManagerModeInProgress: React.PropTypes.bool.isRequired,
        leaveManagerMode: React.PropTypes.func.isRequired,
        venue: React.PropTypes.object.isRequired,
        rota: React.PropTypes.object.isRequired
    }
    render(){
        var returnToStaffTypeSelectorButton = null;
        var leaveManagerModeButton = null;
        if (!this.props.userIsManagerOrSupervisor) {
            returnToStaffTypeSelectorButton = <a
                    className="btn btn-default"
                    style={{float: "right"}}
                    onClick={this.props.returnToStaffTypeSelector}>
                    Select a different staff type
                </a>
        } else {
            leaveManagerModeButton = <div style={{float: "right"}}>
                <LeaveManagerModeButton
                    userIsManager={this.props.userIsManager}
                    userIsSupervisor={this.props.userIsSupervisor}
                    leaveManagerModeInProgress={this.props.leaveManagerModeInProgress}
                    leaveManagerMode={this.props.leaveManagerMode} />
                </div>
        }
        return <div>
            {leaveManagerModeButton}
            {returnToStaffTypeSelectorButton}
            <h1>
                {this.props.venue.name} - {moment(this.props.rota.date).format("ddd D MMMM YYYY")}
            </h1>
        </div>
    }
}
