import React from "react"
import moment from "moment"
import LeaveManagerModeButton from "./leave-manager-mode-button"

export default class Header extends React.Component {
    static propTypes = {
        returnToStaffTypeSelector: React.PropTypes.func.isRequired,
        userIsManagerOrSupervisor: React.PropTypes.bool.isRequired,
        leaveManagerModeInProgress: React.PropTypes.bool.isRequired,
        leaveManagerMode: React.PropTypes.func.isRequired,
        reloadPage: React.PropTypes.func.isRequired,
        venue: React.PropTypes.object.isRequired,
        rota: React.PropTypes.object.isRequired
    }
    render(){
        var returnToStaffTypeSelectorButton = null;
        var managerButtons = null;
        var refetchDataButton = null;
        var reloadPageButton = <button
            className="button small secondary"
            style={{marginRight: 2}}
            onClick={this.props.reloadPage}>
            <i className="fa fa-refresh" /> Reload Page
        </button>
        if (!this.props.userIsManagerOrSupervisor) {
            returnToStaffTypeSelectorButton = <a
                    className="button small ml-base"
                    onClick={this.props.returnToStaffTypeSelector}>
                    Select a different staff type
                </a>
        } else {
            managerButtons = <div style={{display: "inline-block"}}>
                <LeaveManagerModeButton
                    leaveManagerModeInProgress={this.props.leaveManagerModeInProgress}
                    leaveManagerMode={this.props.leaveManagerMode} />
                </div>
        }
        return <div>
            <div style={{float: "right"}}>
                {reloadPageButton}
                {managerButtons}
                {returnToStaffTypeSelectorButton}
            </div>
            <h1 style={{fontSize: 26}}>
                {this.props.venue.name} - {moment(this.props.rota.date).format("ddd D MMMM YYYY")}
            </h1>
        </div>
    }
}
