import React, { Component } from "react"
import { connect } from "react-redux"
import _ from "underscore"
import ClockInOutStaffFinder from "./staff-finder"
import actions from "~redux/actions"
import {
    selectRotaOnClockInOutPage,
    selectLeaveManagerModeIsInProgress,
    selectClockInOutAppIsInManagerMode,
    selectClockInOutAppUserPermissions
} from "~redux/selectors"
import ConfirmationModal from "~components/confirmation-modal"
import LargeStaffTypeSelector from "../components/large-staff-type-selector"
import getStaffTypesWithStaffMembers from "~lib/get-staff-types-with-staff-members"
import UserActionConfirmationMessages from "~components/user-action-confirmation-messages"
import Header from "../components/header"
import LoadAppDataDialog from "./load-app-data-dialog"
import Clock from "../components/clock"

class ClockInOutView extends Component {
    render() {
        if (!this.props.hasLoadedAppData) {
            return <div>
                <LoadAppDataDialog />
                {this.getReloadPageButton()}
            </div>
        } else {
            return this.getClockInOutUI();
        }
    }
    getReloadPageButton(){
        return <div style={{marginTop: 20}}>
            <button
                className="button small secondary"
                onClick={() => location.reload()}>
                <i className="fa fa-refresh" /> Reload Page
            </button>
        </div>
    }
    getClockInOutUI(){
        var classes = ["container"];
        if (this.props.userIsManagerOrSupervisor) {
            classes.push("managerMode");
        }

        var resetVenueButton = null;
        if (this.props.userPermissions.resetVenue) {
            resetVenueButton = <button
                className="button alert"
                style={{marginTop: 20, marginBottom: 20}}
                onClick={() => this.resetVenue()}>
                Reset Venue
            </button>
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
                />
                <ClockInOutStaffFinder
                    selectedStaffTypeClientId={this.props.selectedStaffTypeClientId}
                    userIsManagerOrSupervisor={this.props.userIsManagerOrSupervisor} />
                {resetVenueButton}
            </div>
        } else {
            content = <div>
                <LargeStaffTypeSelector
                    staffTypes={this.props.staffTypes}
                    onSelect={({staffType}) => this.props.selectStaffType(staffType.clientId)} />
                <div>
                    <div style={{marginRight: 16, float: "right"}}>
                        <Clock />
                    </div>
                    {this.getReloadPageButton()}
                </div>
            </div>
        }

        return <div className={classes.join(" ")}>
            <ConfirmationModal />
            <UserActionConfirmationMessages />
            {content}
        </div>
    }
    resetVenue(){
        var message = "You'll have to re-enter the venue key after resetting the venue." +
            "\n\nDo you want to continue?"
        if (!confirm(message)){
            return;
        }
        this.props.resetApiKey();
    }
}

function mapStateToProps(state) {
    if (_.values(state.staffMembers).length === 0) {
        return {hadLoadedAppData: false};
    }
    var rota = selectRotaOnClockInOutPage(state);
    return {
        hasLoadedAppData: true,
        userIsManagerOrSupervisor: selectClockInOutAppIsInManagerMode(state),
        rota,
        apiKey: state.apiKey,
        staffMembers: state.staffMembers,
        leaveManagerModeInProgress: selectLeaveManagerModeIsInProgress(state),
        venue: rota.venue.get(state.venues),
        staffTypes: getStaffTypesWithStaffMembers(state.staffTypes, state.staffMembers),
        selectedStaffTypeClientId: state.clockInOutAppSelectedStaffType,
        userPermissions: selectClockInOutAppUserPermissions(state),
    }
}

function mapDispatchToProps(dispatch){
    return {
        leaveManagerMode: function(){
            dispatch(actions.clockInOutAppEnterUserMode({
                userMode: "User"
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
