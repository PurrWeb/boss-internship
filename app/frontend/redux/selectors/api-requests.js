import utils from "~lib/utils"

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

export function selectAddClockInNoteIsInProgress(state, clockInDayClientId){
    return requestIsInProgressWithRequestData(
        state.apiRequestsInProgress.ADD_CLOCK_IN_NOTE,
    function(requestOptions){
        return requestOptions.clockInDay.clientId === clockInDayClientId
    })
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
