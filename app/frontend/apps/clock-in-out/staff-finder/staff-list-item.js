import React, {Component} from "react"
import { connect } from "react-redux"
import oFetch from "o-fetch"
import utils from "~lib/utils"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import StaffStatusBadge from "~components/staff-status-badge"
import ToggleStaffClockedInButton from "../toggle-staff-clocked-in-button"
import ToggleStaffOnBreakButton from "../toggle-staff-on-break-button"
import {
    selectShiftsByStaffMemberClientId,
    selectIsUpdatingStaffMemberStatus,
    selectEnterManagerModeIsInProgress,
    selectIsUpdatingStaffMemberPin,
    selectClockInOutAppUserPermissions
} from "~redux/selectors"
import staffStatusOptionsByValue from "~lib/staff-status-options-by-value"
import * as actions from "~redux/actions"
import Spinner from "~components/spinner"

var columnNameStyle = {
    textDecoration: "underline"
}

class ClockInOutStaffListItem extends Component {
    render(){
        var staffObject = this.props.staff;
        var staffStatusValue = this.props.clockInStatuses[staffObject.clientId].status;
        var staffStatus = oFetch(staffStatusOptionsByValue, staffStatusValue);
        var staffTypeObject = staffObject.staff_type.get(this.props.staffTypes);

        var rotaedShiftsColumn = null;
        var statusToggleButtons = null;

        rotaedShiftsColumn = <div className="col-md-3 col-xs-9">
            <span style={columnNameStyle}>
                Rotaed Shifts
            </span>
            <StaffShiftList
                shifts={utils.indexByClientId(this.props.staffMemberShifts)}
                rotas={this.props.rotas}
                venues={this.props.venues} />
        </div>;

        statusToggleButtons = <div className="col-md-2 col-xs-9" style={{paddingTop: 5}}>
            {this.getStaffMemberStatusToggleButtons()}
        </div>

        return <div className="staff-list-item staff-list-item--clock-in-out">
            <div className="row">
                <div className="col-md-1 col-xs-2">
                    <img src={staffObject.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-3 col-xs-10">
                    <div className="staff-list-item--clock-in-out__name">
                        {staffObject.first_name} {staffObject.surname}
                    </div>
                    <StaffTypeBadge
                        staffTypeObject={staffTypeObject} />
                    <div className="staff-list-item--clock-in-out__manager-buttons">
                        {this.getChangePinButton()}
                        {this.getManagerModeButton()}
                    </div>
                </div>
                {rotaedShiftsColumn}
                <div className="col-md-2 col-xs-2 staff-list-item--clock-in-out__status">
                    <StaffStatusBadge staffStatusObject={staffStatus} />
                </div>
                {statusToggleButtons}
            </div>
        </div>
    }
    getStaffMemberStatusToggleButtons(){
        if (this.props.updateStatusIsInProgress) {
            return <Spinner />
        }

        var staffObject = this.props.staff;
        var toggleOnBreakButton = null;
        if (this.props.userPermissions.toggleOnBreak){
            toggleOnBreakButton = <div className="col-md-6 col-xs-2">
                <ToggleStaffOnBreakButton
                    clockInStatuses={this.props.clockInStatuses}
                    staffObject={staffObject}
                    updateStaffStatusWithConfirmation={(options) => this.updateStaffStatus(options)} />
            </div>;
        }
        return <div className="row">
            <div className="col-md-6 col-xs-2">
                <ToggleStaffClockedInButton
                    clockInStatuses={this.props.clockInStatuses}
                    staffObject={staffObject}
                    updateStaffStatusWithConfirmation={(options) => this.updateStaffStatus(options)} />
            </div>
            {toggleOnBreakButton}
        </div>
    }
    updateStaffStatus({statusValue, staffMemberObject}){
        var currentStatus = this.props.clockInStatuses[staffMemberObject.clientId].status;
        this.props.updateStaffStatusWithConfirmation({
            statusValue,
            staffMemberObject,
            currentStatus,
            at: new Date(),
            venueServerId: this.props.pageOptions.venue.serverId,
            date: this.props.pageOptions.dateOfRota
        })
    }
    getChangePinButton(){
        var staffObject = this.props.staff;
        if (!this.props.userPermissions.changePin) {
            return null;
        }

        if (this.props.updateStaffMemberPinInProgress) {
            return <Spinner />
        }

        return <a
                className="btn btn-default btn-sm show-in-manager-mode--inline-block"
                data-test-marker-change-pin-button
                onClick={() => this.props.updateStaffMemberPin({
                    staffMemberObject: staffObject
                })}>
                Change Pin
            </a>
    }
    isManager(){
        return this.props.staff.isManager({staffTypes: this.props.staffTypes});
    }
    isSupervisor(){
        return this.props.staff.isSupervisor({staffTypes: this.props.staffTypes});
    }
    enterManagerMode(){
        this.props.enterManagerMode();
    }
    getManagerModeButton(){
        if (!this.isManager() && !this.isSupervisor()) {
            return null;
        }
        if (this.props.enterManagerModeIsInProgress){
            return <Spinner />;
        }
        var buttonText = null;
        var modeType = null;
        if (this.isManager()){
            buttonText = "Enter Manager Mode";
            modeType = "manager"
        } else if (this.isSupervisor()) {
            buttonText = "Enter Supervisor Mode";
            modeType = "supervisor"
        } else {
            throw new Error("Shouldn't be possible")
        }

        return <a
            onClick={() => this.props.enterUserMode(modeType, this.props.staff)}
            data-test-marker-enter-manager-mode
            className="btn btn-default btn-sm hide-in-manager-mode--inline-block">
            {buttonText}
        </a>
    }
}

function mapStateToProps(state, ownProps){
    return {
        staffTypes: state.staffTypes,
        clockInStatuses: state.clockInStatuses,
        staffMemberShifts: selectShiftsByStaffMemberClientId(state, ownProps.staff.clientId),
        rotas: state.rotas,
        venues: state.venues,
        updateStatusIsInProgress: selectIsUpdatingStaffMemberStatus(state, {
            staffMemberServerId: ownProps.staff.serverId
        }),
        enterManagerModeIsInProgress: selectEnterManagerModeIsInProgress(state, {staffMemberServerId: ownProps.staff.serverId}),
        updateStaffMemberPinInProgress: selectIsUpdatingStaffMemberPin(state, {
            staffMemberServerId: ownProps.staff.serverId
        }),
        userPermissions: selectClockInOutAppUserPermissions(state),
        pageOptions: state.pageOptions
    }
}

function mapDispatchToProps(dispatch){
    return {
        updateStaffStatusWithConfirmation: function(options){
            dispatch(actions.updateStaffStatusWithConfirmation(options))
        },
        enterUserMode: function(userMode, staffMemberObject){
            dispatch(actions.enterUserModeWithConfirmation({userMode, staffMemberObject}));
        },
        updateStaffMemberPin: function(options){
            dispatch(actions.updateStaffMemberPinWithEntryModal(options))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClockInOutStaffListItem);
