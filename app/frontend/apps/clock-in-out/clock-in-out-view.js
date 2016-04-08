import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "~redux/store"
import moment from "moment"
import ClockInOutStaffFinder from "./staff-finder/staff-finder"
import * as actions from "~redux/actions"
import {
    selectRotaOnClockInOutPage,
    selectClockInOutAppUserIsSupervisor,
    selectClockInOutAppUserIsManager,
    selectLeaveManagerModeIsInProgress
} from "~redux/selectors"
import ConfirmationModal from "~components/confirmation-modal"
import Spinner from "~components/spinner"
import LargeStaffTypeSelector from "./components/large-staff-type-selector"
import getStaffTypesWithStaffMembers from "~lib/get-staff-types-with-staff-members"
import UserActionConfirmationMessages from "~components/user-action-confirmation-messages"

class LeaveManagerModeButton extends Component {
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

class ClockInOutView extends Component {
    render() {
        var classes = ["container"];
        if (this.props.userIsManagerOrSupervisor) {
            classes.push("managerMode");
        }

        var content = null;
        if (this.props.selectedStaffTypeClientId !== null) {
            content = <div>
                {this.getHeader()}
                <ClockInOutStaffFinder
                    selectedStaffTypeClientId={this.props.selectedStaffTypeClientId}
                    userIsManagerOrSupervisor={this.props.userIsManagerOrSupervisor} />
            </div>
        } else {
            content = <LargeStaffTypeSelector
                staffTypes={this.props.staffTypes}
                onSelect={({staffType}) => this.props.selectStaffType(staffType.clientId)} />
        }

        return <div className={classes.join(" ")}>
            <ConfirmationModal />
            <UserActionConfirmationMessages />
            {content}
        </div>
    }
    getHeader(){
        var returnToStaffTypeSelectorButton = null;
        var leaveManagerModeButton = null;
        if (!this.props.userIsManagerOrSupervisor) {
            returnToStaffTypeSelectorButton = <a
                    className="btn btn-default"
                    style={{float: "right"}} 
                    onClick={()=> this.props.selectStaffType(null)}>
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

function mapStateToProps(state) {
    var rota = selectRotaOnClockInOutPage(state);
    var userIsSupervisor = selectClockInOutAppUserIsSupervisor(state);
    var userIsManager = selectClockInOutAppUserIsManager(state);
    return {
        userIsManagerOrSupervisor: userIsSupervisor || userIsManager,
        userIsManager,
        userIsSupervisor,
        rota,
        leaveManagerModeInProgress: selectLeaveManagerModeIsInProgress(state),
        venue: rota.venue.get(state.venues),
        staffTypes: getStaffTypesWithStaffMembers(state.staffTypes, state.staff),
        selectedStaffTypeClientId: state.clockInOutAppSelectedStaffType
    }
}

function mapDispatchToProps(dispatch){
    return {
        leaveManagerMode: function(){
            dispatch(actions.clockInOutAppEnterUserMode({
                userMode: "user"
            }))
        },
        selectStaffType: function(selectedStaffTypeClientId){
            dispatch(actions.clockInOutAppSelectStaffType({
                selectedStaffTypeClientId
            }))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClockInOutView);
