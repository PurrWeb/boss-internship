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
import LoadAppDataDialog from "./containers/load-app-data-dialog"


class ClockInOutView extends Component {
    render() {
        if (!this.props.hasLoadedAppData) {
            return <LoadAppDataDialog />
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
                    reloadPage={() => location.reload()}
                    resetVenue={() => {
                        var message = "You'll have to re-enter the venue key after resetting the venue." +
                            "\n\n Do you want to continue?"
                        if (!confirm(message)){
                            return;
                        }
                        this.props.resetApiKey();
                    }}
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
    if (_.values(state.staffMembers).length === 0) {
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
        apiKey: state.apiKey,
        staffMembers: state.staffMembers,
        leaveManagerModeInProgress: selectLeaveManagerModeIsInProgress(state),
        venue: rota.venue.get(state.venues),
        staffTypes: getStaffTypesWithStaffMembers(state.staffTypes, state.staffMembers),
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
        },
        resetApiKey: function(){
            // reset store also updates the apiKey, which means it'll
            // be updated in localStorage
            dispatch(actions.resetStore());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClockInOutView);
