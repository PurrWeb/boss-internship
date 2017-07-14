import utils from "~/lib/utils"
import oFetch from "o-fetch"
import _ from "underscore"
import { createSelector } from "reselect"

export function selectEditHoursAcceptancePeriodIsInProgress(state, hoursAcceptancePeriod){
    return selectAcceptHoursAcceptancePeriodIsInProgress(state, hoursAcceptancePeriod) ||
        selectUnacceptHoursAcceptancePeriodIsInProgress(state, hoursAcceptancePeriod) ||
        selectDeleteHoursAcceptancePeriodIsInProgress(state, hoursAcceptancePeriod)
}

function requestIsInProgressWithRequestData(requests, matchFunction) {
    if (!requests || requests.length === 0) {
        return false;
    }

    return _.any(requests, matchFunction);
}

function selectAcceptHoursAcceptancePeriodIsInProgress(state, hoursAcceptancePeriod) {
    return requestIsInProgressWithRequestData(
        state.apiRequestsInProgress.ACCEPT_HOURS_ACCEPTANCE_PERIOD,
    function(requestOptions){
        return requestOptions.hoursAcceptancePeriod.clientId === hoursAcceptancePeriod.clientId;
    });
}

function selectUnacceptHoursAcceptancePeriodIsInProgress(state, hoursAcceptancePeriod) {
    return requestIsInProgressWithRequestData(
        state.apiRequestsInProgress.UNACCEPT_HOURS_ACCEPTANCE_PERIOD,
    function(requestOptions){
        return requestOptions.hoursAcceptancePeriod.clientId === hoursAcceptancePeriod.clientId;
    });
}

function selectDeleteHoursAcceptancePeriodIsInProgress(state, hoursAcceptancePeriod) {
    return requestIsInProgressWithRequestData(
        state.apiRequestsInProgress.DELETE_HOURS_ACCEPTANCE_PERIOD,
    function(requestOptions){
        return requestOptions.hoursAcceptancePeriod.clientId === hoursAcceptancePeriod.clientId;
    });
}

export function selectIsForceClockingOutClockInDay(state, staffMemberClientId){
    return requestIsInProgressWithRequestData(
        state.apiRequestsInProgress.FORCE_STAFF_MEMBER_CLOCK_OUT,
    function(requestOptions){
        return requestOptions.staffMember.clientId == staffMemberClientId
    })
}

var emptyList = []
function getAddClockInNoteApiRequestsInProgress(state){
    var ret = state.apiRequestsInProgress.ADD_CLOCK_IN_NOTE;
    if (!ret) {
        ret = emptyList;
    }
    return ret
}

var getAddClockInNoteIsInProgressByClockInDay = createSelector(
    getAddClockInNoteApiRequestsInProgress,
    function(addClockInNoteRequestsInProgress){
        return _(addClockInNoteRequestsInProgress).groupBy(function(clockInNote){
            return clockInNote.clockInDay.clientId
        })
    }
)

export function selectAddClockInNoteIsInProgress(state, clockInDayClientId){
    return getAddClockInNoteIsInProgressByClockInDay(state)[clockInDayClientId]
}

export function selectFetchWeeklyRotaIsInProgress(state){
    return !_.isEmpty(state.apiRequestsInProgress.FETCH_WEEKLY_ROTA_FORECAST);
}

export function selectUpdateRotaForecastInProgress(state, {serverVenueId, dateOfRota}){
    var updatesInProgress = state.apiRequestsInProgress.UPDATE_ROTA_FORECAST;
    return requestIsInProgressWithRequestData(updatesInProgress, function(update){
        var isSameDate = utils.datesAreEqual(update.dateOfRota, dateOfRota);
        var isSameVenue = serverVenueId === update.serverVenueId;
        return isSameVenue && isSameDate;
    })
}

export function selectClockInOutLoadAppDataIsInProgress(state){
    var requests = state.apiRequestsInProgress.CLOCK_IN_OUT_APP_FETCH_DATA;
    return requests !== undefined && requests.length > 0;
}

export function selectIsUpdatingStaffMemberStatus(state, {staffMemberServerId}) {
    var allRequests = state.apiRequestsInProgress.UPDATE_CLOCK_IN_STATUS;
    var requestsForStaffMember = _.filter(allRequests, function(request){
        return request.staffMemberObject.serverId === staffMemberServerId;
    });
    return requestsForStaffMember.length > 0;
}

export function selectEnterManagerModeIsInProgress(state, {staffMemberServerId}){
    var requests = state.apiRequestsInProgress.CLOCK_IN_OUT_APP_ENTER_USER_MODE;
    if (!requests || requests.length === 0) {
        return false;
    }
    if (requests[0].staffMemberObject === undefined) {
        return false; // no staff member specified, probably leaving manager mode
    }
    var staffMemberMatches = oFetch(requests[0], "staffMemberObject.serverId") === staffMemberServerId;
    var isEnteringManagerMode = oFetch(requests[0], "userMode") !== "user";
    return isEnteringManagerMode && staffMemberMatches;
}

export function selectLeaveManagerModeIsInProgress(state){
    var requests = state.apiRequestsInProgress.CLOCK_IN_OUT_APP_ENTER_USER_MODE;
    if (!requests || requests.length === 0) {
        return false;
    }
    return oFetch(requests[0], "userMode") === "user";
}

export function selectIsUpdatingStaffMemberPin(state, {staffMemberServerId}) {
    var allRequests = state.apiRequestsInProgress.UPDATE_STAFF_MEMBER_PIN;
    var requestsForStaffMember = _.filter(allRequests, function(request){
        return request.staffMemberObject.serverId === staffMemberServerId;
    });
    return requestsForStaffMember.length > 0;
}

export function selectShiftIsBeingEdited(state, options){
    var shiftServerId = oFetch(options, "shiftServerId");

    var shiftsBeingUpdated = state.apiRequestsInProgress.UPDATE_SHIFT;
    var shiftsBeingDeleted = state.apiRequestsInProgress.DELETE_SHIFT;

    var isBeingUpdated = _(shiftsBeingUpdated).some((request) => request.shiftServerId === shiftServerId);
    var isBeingDeleted = _(shiftsBeingDeleted).some((request) => request.shift.serverId === shiftServerId);

    return isBeingUpdated || isBeingDeleted;
}


export function selectAddShiftIsInProgress(state, staffMemberServerId){
    var shiftsBeingAdded = state.apiRequestsInProgress.ADD_SHIFT;
    return _(shiftsBeingAdded).some(
        (request) => request.staffMemberServerId === staffMemberServerId
    );
}
