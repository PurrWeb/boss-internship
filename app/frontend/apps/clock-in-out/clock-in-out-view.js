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
    selectClockInOutAppUserIsManager
} from "~redux/selectors"
import ConfirmationModal from "~components/confirmation-modal"
import LargeStaffTypeSelector from "./components/large-staff-type-selector"
import getStaffTypesWithStaffMembers from "~lib/get-staff-types-with-staff-members"
import UserActionConfirmationMessages from "~components/user-action-confirmation-messages"

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
            var leaveManagerModeButtonText;
            if (this.props.userIsManager){
                leaveManagerModeButtonText = "Leave Manager Mode";
            } else if (this.props.userIsSupervisor) {
                leaveManagerModeButtonText = "Leave Supervisor Mode"
            }
            leaveManagerModeButton = <a
                className="btn btn-default show-in-manager-mode"
                style={{float: "right"}}
                onClick={() => this.props.leaveManagerMode()}>
                {leaveManagerModeButtonText}
            </a>
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
