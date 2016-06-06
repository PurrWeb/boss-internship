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
        refetchAllData: React.PropTypes.func.isRequired,
        venue: React.PropTypes.object.isRequired,
        rota: React.PropTypes.object.isRequired
    }
    render(){
        var returnToStaffTypeSelectorButton = null;
        var managerButtons = null;
        var refetchDataButton = null;
        if (!this.props.userIsManagerOrSupervisor) {
            returnToStaffTypeSelectorButton = <a
                    className="btn btn-default"
                    onClick={this.props.returnToStaffTypeSelector}>
                    Select a different staff type
                </a>
        } else {
            managerButtons = <div>
                <button
                    className="btn btn-default"
                    style={{marginRight: 2}}
                    onClick={this.props.refetchAllData}>
                    Reload All Data
                </button>
                <LeaveManagerModeButton
                    userIsManager={this.props.userIsManager}
                    userIsSupervisor={this.props.userIsSupervisor}
                    leaveManagerModeInProgress={this.props.leaveManagerModeInProgress}
                    leaveManagerMode={this.props.leaveManagerMode} />
                </div>
        }
        return <div>
            <div style={{float: "right"}}>
                {managerButtons}
                {returnToStaffTypeSelectorButton}
            </div>
            <h1 style={{fontSize: 26}}>
                {this.props.venue.name} - {moment(this.props.rota.date).format("ddd D MMMM YYYY")}
            </h1>
        </div>
    }
}
