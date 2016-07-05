import React, {Component} from "react"
import { connect } from "react-redux"
import oFetch from "o-fetch"
import utils from "~lib/utils"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import ClockInStatusBadge from "~components/clock-in-status-badge"
import ToggleStaffClockedInButton from "../components/toggle-staff-clocked-in-button"
import ToggleStaffOnBreakButton from "../components/toggle-staff-on-break-button"
import {
    selectShiftsByStaffMemberClientId,
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
        var staffMember = this.props.staff;
        var clockInStatusValue = this.props.clockInDay.status

        var rotaedShiftsColumn = null;
        var statusToggleButtons = null;

        rotaedShiftsColumn = <div className="col-md-2 col-xs-9">
            <span style={columnNameStyle}>
                Rotaed Shifts
            </span>
            <StaffShiftList
                shifts={utils.indexByClientId(this.props.staffMemberShifts)}
                rotas={this.props.rotas}
                venues={this.props.venues} />
        </div>;

        statusToggleButtons = <div className="col-md-3 col-xs-9" style={{paddingTop: 5}}>
            {this.getStaffMemberStatusToggleButtons()}
        </div>

        return <div className="staff-list-item staff-list-item--clock-in-out">
            <div className="row">
                <div className="col-md-1 col-xs-2">
                    <img src={staffMember.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-4 col-xs-10">
                    <div className="staff-list-item--clock-in-out__name">
                        {staffMember.first_name} {staffMember.surname}
                    </div>
                    <StaffTypeBadge
                        staffTypeObject={staffMember.staffType} />
                    <div className="staff-list-item--clock-in-out__manager-buttons">
                        {this.getAddNoteButton()}
                        {this.getChangePinButton()}
                        {this.getManagerModeButton()}

                    </div>
                </div>
                {rotaedShiftsColumn}
                <div className="col-md-2">
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
        var staffMember = this.props.staff;
        if (staffMember.updateStatusInProgress) {
            return <Spinner />
        }

        var toggleOnBreakButton = null;
        if (this.props.userPermissions.toggleOnBreak){
            toggleOnBreakButton = <div className="col-md-6 col-xs-2">
                <ToggleStaffOnBreakButton
                    clockInDay={this.props.clockInDay}
                    staffObject={staffMember}
                    updateClockInStatusWithConfirmation={(options) => this.updateClockInStatus(options)} />
            </div>;
        }
        return <div className="row">
            <div className="col-md-6 col-xs-2">
                <ToggleStaffClockedInButton
                    clockInDay={this.props.clockInDay}
                    staffObject={staffMember}
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
        var staffMember = this.props.staff;
        if (!this.props.userPermissions.changePin) {
            return null;
        }

        if (staffMember.updatePinInProgress) {
            return <Spinner />
        }

        return <a
                className="btn btn-default btn-sm show-in-manager-mode--inline-block"
                data-test-marker-change-pin-button
                onClick={() => this.props.updateStaffMemberPin({
                    staffMemberObject: staffMember
                })}>
                Change Pin
            </a>
    }
    enterManagerMode(){
        this.props.enterManagerMode();
    }
    getManagerModeButton(){
        var staffMember = this.props.staff;
        if (!staffMember.canEnterManagerMode) {
            return null;
        }
        if (staffMember.enterManagerModeInProgress){
            return <Spinner />;
        }

        return <a
            onClick={() => this.props.enterUserMode(staffMember.staffType.name, this.props.staff)}
            data-test-marker-enter-manager-mode
            className="btn btn-default btn-sm hide-in-manager-mode--inline-block">
            Enter Manager Mode
        </a>
    }
}

function mapStateToProps(state, ownProps){
    var clockInDay = selectClockInDay(state, {
        staffMemberClientId: ownProps.staff.clientId,
        date: state.pageOptions.dateOfRota
    })
    return {
        clockInDay,
        staffMemberShifts: selectShiftsByStaffMemberClientId(state, ownProps.staff.clientId),
        rotas: state.rotas,
        venues: state.venues,
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
