import React, {Component} from "react"
import { connect } from "react-redux"
import oFetch from "o-fetch"
import utils from "~lib/utils"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import ClockInStatusBadge from "~components/clock-in-status-badge"
import ToggleStaffClockedInButton from "../toggle-staff-clocked-in-button"
import ToggleStaffOnBreakButton from "../toggle-staff-on-break-button"
import {
    selectShiftsByStaffMemberClientId,
    selectIsUpdatingStaffMemberStatus,
    selectEnterManagerModeIsInProgress,
    selectIsUpdatingStaffMemberPin,
    selectClockInOutAppUserPermissions,
    selectClockInDay,
    selectAddClockInNoteIsInProgress
} from "~redux/selectors"
import actions from "~redux/actions"
import Spinner from "~components/spinner"
import ClockInNotesList from "~components/clock-in-notes-list"

var columnNameStyle = {
    textDecoration: "underline"
}

class ClockInOutStaffListItem extends Component {
    render(){
        var staffObject = this.props.staff;
        var clockInStatusValue = this.props.clockInDay.status
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
                        {this.getAddNoteButton()}
                        {this.getChangePinButton()}
                        {this.getManagerModeButton()}

                    </div>
                </div>
                {rotaedShiftsColumn}
                <div className="col-xs-3">
                    {this.getClockInNotesList()}
                </div>
                <div className="col-md-2 col-xs-2 staff-list-item--clock-in-out__status">
                    <ClockInStatusBadge clockInStatusValue={clockInStatusValue} />
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
                    clockInDay={this.props.clockInDay}
                    staffObject={staffObject}
                    updateClockInStatusWithConfirmation={(options) => this.updateClockInStatus(options)} />
            </div>;
        }
        return <div className="row">
            <div className="col-md-6 col-xs-2">
                <ToggleStaffClockedInButton
                    clockInDay={this.props.clockInDay}
                    staffObject={staffObject}
                    updateClockInStatusWithConfirmation={(options) => this.updateClockInStatus(options)} />
            </div>
            {toggleOnBreakButton}
        </div>
    }
    getClockInNotesList(){
        if (!this.props.userPermissions.addNote) {
            return null;
        }
        return <div>
            <div style={{textDecoration: "underline"}}>Notes: </div>
            <ClockInNotesList notes={this.props.clockInNotes} />
        </div>
    }
    getAddNoteButton(){
        if (!this.props.userPermissions.addNote) {
            return null;
        }
        if (this.props.addClockInNoteIsInProgress){
            return <Spinner />
        }
        return <button
            className="btn btn-default btn-sm"
            style={{marginRight: 2}}
            data-test-marker-add-note
            onClick={() => this.props.addNote(
                this.props.staff,
                this.props.clockInDay
            )}>
            Add Note
        </button>
    }
    updateClockInStatus({statusValue, staffMemberObject}){
        var currentStatus = this.props.clockInDay.status;
        this.props.updateClockInStatusWithConfirmation({
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
    enterManagerMode(){
        this.props.enterManagerMode();
    }
    getManagerModeButton(){
        var staffMember = this.props.staff;
        if (!staffMember.isManager && !staffMember.isSupervisor) {
            return null;
        }
        if (this.props.enterManagerModeIsInProgress){
            return <Spinner />;
        }
        var buttonText = null;
        var modeType = null;
        if (staffMember.isSupervisor){
            buttonText = "Enter Supervisor Mode";
            modeType = "supervisor"
        } else {
            buttonText = "Enter Manager Mode";
            modeType = "manager"
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
    var clockInDay = selectClockInDay(state, {
        staffMemberClientId: ownProps.staff.clientId,
        date: state.pageOptions.dateOfRota
    })
    return {
        staffTypes: state.staffTypes,
        clockInDay,
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
        pageOptions: state.pageOptions,
        clockInNotes: _.filter(state.clockInNotes, function(note){
            return note.clock_in_day.clientId === clockInDay.clientId
        }),
        addClockInNoteIsInProgress: selectAddClockInNoteIsInProgress(state, clockInDay.clientId)
    }
}

function mapDispatchToProps(dispatch){
    return {
        updateClockInStatusWithConfirmation: function(options){
            dispatch(actions.updateClockInStatusWithConfirmation(options))
        },
        enterUserMode: function(userMode, staffMemberObject){
            dispatch(actions.enterUserModeWithConfirmation({userMode, staffMemberObject}));
        },
        updateStaffMemberPin: function(options){
            dispatch(actions.updateStaffMemberPinWithEntryModal(options))
        },
        addNote: function(staffMemberObject, clockInDay){
            var note = prompt("Add staff note for " + staffMemberObject.first_name +
                " " + staffMemberObject.surname)
            if (typeof note === "string" && note !== "") {
                dispatch(actions.addClockInNote({
                    text: note,
                    staffMemberObject,
                    clockInDay
                }))
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClockInOutStaffListItem);
