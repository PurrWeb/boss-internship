import React, { Component } from "react"
import { connect } from "react-redux"
import _ from "underscore"
import ClockInOutStaffFinder from "./staff-finder/staff-finder"
import actions from "~redux/actions"
import {
    selectRotaOnClockInOutPage,
    selectClockInOutAppUserIsSupervisor,
    selectClockInOutAppUserIsManager,
    selectLeaveManagerModeIsInProgress
} from "~redux/selectors"
import ConfirmationModal from "~components/confirmation-modal"
import LargeStaffTypeSelector from "./components/large-staff-type-selector"
import getStaffTypesWithStaffMembers from "~lib/get-staff-types-with-staff-members"
import UserActionConfirmationMessages from "~components/user-action-confirmation-messages"
import Header from "./components/header"
import KeyDialog from "./containers/key-dialog"


class ClockInOutView extends Component {
    render() {
        if (!this.props.hasLoadedAppData) {
            return <KeyDialog />
        } else {
            return this.getClockInOutUI();
        }
    }
    getClockInOutUI(){
        var classes = ["container"];
        if (this.props.userIsManagerOrSupervisor) {
            classes.push("managerMode");
        }

        var content = null;
        if (this.props.selectedStaffTypeClientId !== null) {
            content = <div>
                <Header
                    returnToStaffTypeSelector={()=> this.props.selectStaffType(null)}
                    userIsManager={this.props.userIsManager}
                    userIsSupervisor={this.props.userIsSupervisor}
                    userIsManagerOrSupervisor={this.props.userIsManagerOrSupervisor}
                    leaveManagerModeInProgress={this.props.leaveManagerModeInProgress}
                    leaveManagerMode={this.props.leaveManagerMode}
                    venue={this.props.venue}
                    rota={this.props.rota}
                />
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
}

function mapStateToProps(state) {
    if (_.values(state.staff).length === 0) {
        return {hadLoadedAppData: false};
    }
    var rota = selectRotaOnClockInOutPage(state);
    var userIsSupervisor = selectClockInOutAppUserIsSupervisor(state);
    var userIsManager = selectClockInOutAppUserIsManager(state);
    return {
        hasLoadedAppData: true,
        userIsManagerOrSupervisor: userIsSupervisor || userIsManager,
        userIsManager,
        userIsSupervisor,
        rota,
        staffMembers: state.staff,
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
