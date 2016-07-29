import {selectStaffMembers} from "./staff-members"
import _ from "underscore"
import { selectClockInDay } from "./clock-in-day"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import { selectShiftsByStaffMemberClientId } from "./shifts"
import { selectAddClockInNoteIsInProgress } from "./api-requests"
import {createSelector} from "reselect"

export function selectStaffMemberCanEnterManagerMode(staffMember){
    if (staffMember.isManager === undefined){
        throw Error("This function needs a staff member that has been expanded in selectStaffMembers.")
    }
    return staffMember.isManager || staffMember.isSupervisor || staffMember.isGeneralManager;
}

export function selectClockInOutAppIsInManagerMode(state){
    var userMode = state.clockInOutAppUserMode.mode;
    return userMode === "Manager" || userMode === "Bar Supervisor" || userMode === "GM";
}

var selectUserMode = state => state.clockInOutAppUserMode.mode;

var selectClockInOutAppUserPermissions = createSelector(
    selectUserMode,
    function(userMode){
        if (userMode === "Manager") {
            return {
                toggleOnBreak: true,
                changePin: true,
                addNote: true,
                resetVenue: true
            }
        }
        if (userMode === "Bar Supervisor") {
            return {
                toggleOnBreak: true,
                changePin: false,
                addNote: true,
                resetVenue: true
            }
        }
        if (userMode === "GM") {
            return {
                toggleOnBreak: true,
                changePin: true,
                addNote: true,
                resetVenue: true
            }
        }

        //  Normal user that's not a manager
        return {
            toggleOnBreak: false,
            changePin: false,
            addNote: false,
            resetVenue: false
        }
    }
)
export {selectClockInOutAppUserPermissions}

export function selectStaffMembersForClockInOutStaffFinder(state){
    var staffMembers = selectStaffMembers(state);
    return _.mapObject(staffMembers, function(staffMember){
        var clockInDay = selectClockInDay(state, {
            staffMemberClientId: staffMember.clientId,
            date: state.pageOptions.dateOfRota
        });

        staffMember.canEnterManagerMode = selectStaffMemberCanEnterManagerMode(staffMember);

        staffMember.isRotaed = selectShiftsByStaffMemberClientId(state, staffMember.clientId).length > 0,
        staffMember.isActive = clockInDay.status !== "clocked_out";
        return staffMember
    })
}


export function selectRotaOnClockInOutPage(state){
    return getRotaFromDateAndVenue({
        rotas: state.rotas,
        dateOfRota: state.pageOptions.dateOfRota,
        venueId: state.pageOptions.venue.clientId
    });
}

function selectClockInOutStaffListItemProps(state, ownProps) {
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
export {selectClockInOutStaffListItemProps}
