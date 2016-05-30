import _ from "underscore"
import utils from "~lib/utils"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import oFetch from "o-fetch"

export function selectStaffTypesWithShifts(state){
    var {rotaShifts, staff} = state;
    rotaShifts = _.values(rotaShifts);

    var allStaffTypes = state.staffTypes;
    var shiftStaffTypes = _(rotaShifts).map(getStaffTypeIdFromShift);
    var staffTypes = _(allStaffTypes).filter(function(staffType){
        return _(shiftStaffTypes).contains(staffType.clientId);
    });
    return utils.indexByClientId(staffTypes);

    function getStaffTypeIdFromShift(shift) {
        return shift.staff_member.get(staff).staff_type.clientId;
    }
}

export function selectVenuesWithShifts(state){
    var {venues, rotas, rotaShifts} = state;

    var venueIdsWithShifts = _(rotaShifts).chain()
        .map(getVenueIdFromShift)
        .unique()
        .value();

    var allVenues = _.values(venues);
    var venuesWithShifts = _.filter(allVenues, function(venue){
        return _(venueIdsWithShifts).contains(venue.clientId);
    });

    return utils.indexByClientId(venuesWithShifts);

    function getVenueIdFromShift(shift){
        var rotaId = shift.rota.clientId;
        var rota = rotas[rotaId];
        return rota.venue.clientId;
    }
}

export function selectStaffMemberHolidays(state, staffId){
    var staffMember = state.staffMembers[staffId];
    var staffMemberHolidayClientIds = _.pluck(staffMember.holidays, "clientId");
    var allHolidays = staffMemberHolidayClientIds.map(function(clientId){
        return state.holidays[clientId];
    });
    // We only have this week's holidays in the state, so filter out
    // any holidays we don't have in the state.
    var availableHolidays = _(allHolidays).filter(function(holiday){
        return holiday !== undefined;
    })
    return availableHolidays;
}

export function selectStaffMemberUnpaidHolidays(state, staffId){
    return _.filter(selectStaffMemberHolidays(state, staffId), {
        holiday_type: "unpaid_holiday"
    })
}

export function selectStaffMemberPaidHolidays(state, staffId){
    return _.filter(selectStaffMemberHolidays(state, staffId), {
        holiday_type: "paid_holiday"
    })
}

export function selectStaffMemberIsOnHolidayOnDate(state, staffId, date){
    var staffMemberHolidays = selectStaffMemberHolidays(state, staffId);
    var isOnHoliday = false;
    staffMemberHolidays.forEach(function(holiday){
        if (holiday.start_date <= date && holiday.end_date >= date){
            isOnHoliday = true;
        }
    });

    return isOnHoliday;
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

export function selectForecastByRotaId(state, rotaClientId){
    var rota = oFetch(state.rotas, rotaClientId);
    var forecast = _(state.rotaForecasts).find(function(forecast){
        var isSameDate = utils.datesAreEqual(rota.date, forecast.date);
        var isSameVenue = rota.venue.clientId === forecast.venue.clientId;
        return isSameVenue && isSameDate;
    })

    if (forecast === undefined){
        throw new Error("Couldn't find rota forecast for rotaClientId " + rotaClientId);
    }

    return forecast;
}

export function selectAddShiftIsInProgress(state, staffMemberServerId){
    var shiftsBeingAdded = state.apiRequestsInProgress.ADD_SHIFT;
    return _(shiftsBeingAdded).some(
        (request) => request.staffMemberServerId === staffMemberServerId
    );
}

export function selectRotaOnVenueRotaPage(state){
    return getRotaFromDateAndVenue({
        rotas: state.rotas,
        dateOfRota: state.pageOptions.dateOfRota,
        venueId: state.pageOptions.venue.clientId
    });
}

export function canEditStaffTypeShifts({staffTypes, pageOptions}, {staffTypeClientId}){
    var staffTypeObject = staffTypes[staffTypeClientId];
    var disabledNames = pageOptions.disableEditingShiftsByStaffTypeName;
    if (!disabledNames) {
        return true;
    }

    if (disabledNames[staffTypeObject.name]){
        return false;
    }
    return true;
}

export function selectShiftIsBeingEdited(state, options){
    var shiftServerId = oFetch(options, "shiftServerId");

    var shiftsBeingUpdated = state.apiRequestsInProgress.UPDATE_SHIFT;
    var shiftsBeingDeleted = state.apiRequestsInProgress.DELETE_SHIFT;

    var isBeingUpdated = _(shiftsBeingUpdated).some((request) => request.shiftServerId === shiftServerId);
    var isBeingDeleted = _(shiftsBeingDeleted).some((request) => request.shift.serverId === shiftServerId);

    return isBeingUpdated || isBeingDeleted;
}

export function selectShiftsWithRotaClientIds(state, clientIds){
    return _.filter(state.rotaShifts, function(shift){
        return _(clientIds).contains(shift.rota.clientId);
    })
}

export function selectRotasOnDate(state, date){
    return _.filter(state.rotas, function(rota){
        return utils.datesAreEqual(rota.date, date);
    })
}

export function selectRotaShiftsOnDayOnStaffTypeRotaPage(state){
    var rotasOnDate = selectRotasOnDate(state, state.pageOptions.dateOfRota);
    var clientIds = rotasOnDate.map(function(rota){
        return rota.clientId;
    });
    var rotaShifts = selectShiftsWithRotaClientIds(state, clientIds);
    return rotaShifts;
}

export function selectShiftsByStaffMemberClientId(state, staffMemberClientId){
    return _(state.rotaShifts).filter(function(shift){
        return shift.staff_member.clientId === staffMemberClientId
    });
}

export function selectRotaOnClockInOutPage(state){
    return getRotaFromDateAndVenue({
        rotas: state.rotas,
        dateOfRota: state.pageOptions.dateOfRota,
        venueId: state.pageOptions.venue.clientId
    });
}

export function selectClockInOutAppIsInManagerMode(state){
    var userMode = state.clockInOutAppUserMode.mode;
    return userMode === "manager" || userMode === "supervisor";
}

export function selectClockInOutAppUserIsManager(state){
    return state.clockInOutAppUserMode.mode === "manager";
}

export function selectClockInOutAppUserIsSupervisor(state){
    return state.clockInOutAppUserMode.mode === "supervisor";
}

export function selectIsUpdatingStaffMemberStatus(state, {staffMemberServerId}) {
    var allRequests = state.apiRequestsInProgress.UPDATE_STAFF_STATUS;
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

export function selectClockInOutAppUserPermissions(state){
    var userMode = state.clockInOutAppUserMode.mode;
    if (userMode === "manager") {
        return {
            toggleOnBreak: true,
            changePin: true
        }
    }
    if (userMode === "supervisor") {
        return {
            toggleOnBreak: true,
            changePin: false
        }
    }
    return {
        toggleOnBreak: false,
        changePin: false
    }
}

export function selectClockInOutLoadAppDataIsInProgress(state){
    var requests = state.apiRequestsInProgress.CLOCK_IN_OUT_APP_FETCH_DATA;
    return requests !== undefined && requests.length > 0;
}

function addBreaksToClockInPeriod(clockInPeriod, clockInBreaks){
    var breaks = _(clockInBreaks).filter(function(clockInBreak){
        return clockInBreak.clock_in_period.clientId === clockInPeriod.clientId
    })
    return Object.assign({}, clockInPeriod, { breaks })
}

function addBreaksToHoursAcceptancePeriod(hoursAcceptancePeriod, hoursAcceptanceBreaks){
    var breaks = _(hoursAcceptanceBreaks).filter(function(hoursAcceptanceBreak){
        return hoursAcceptanceBreak.hours_acceptance_period.clientId === hoursAcceptancePeriod.clientId
    })
    return Object.assign({}, hoursAcceptancePeriod, { breaks })
}

export function selectClockInDayDetails(state, clockInDay){
    var staffMember = clockInDay.staff_member.get(state.staffMembers);
    staffMember.forceClockoutIsInProgress = selectIsForceClockingOutStaffMember(state, staffMember.clientId)
    staffMember.clockInStatus = state.clockInStatuses[staffMember.clientId].status

    var clockInPeriods = _(state.clockInPeriods).filter(function(clockInPeriod){
        return clockInPeriod.clock_in_day.clientId === clockInDay.clientId;
    });
    var hoursAcceptancePeriods = _(state.hoursAcceptancePeriods).filter(function(hoursAcceptancePeriod){
        return hoursAcceptancePeriod.clock_in_day.clientId === clockInDay.clientId;
    })

    clockInPeriods = clockInPeriods.map(function(clockInPeriod){
        return addBreaksToClockInPeriod(clockInPeriod, state.clockInBreaks)
    })
    hoursAcceptancePeriods = hoursAcceptancePeriods.map(function(hoursAcceptancePeriod){
        return addBreaksToHoursAcceptancePeriod(hoursAcceptancePeriod, state.hoursAcceptanceBreaks)
    })
    hoursAcceptancePeriods.forEach(function(hoursAcceptancePeriod){
        hoursAcceptancePeriod.updateIsInProgress = selectEditHoursAcceptancePeriodIsInProgress(state, hoursAcceptancePeriod)
    })

    var rota = getRotaFromDateAndVenue({
        dateOfRota: clockInDay.date,
        venueId: clockInDay.venue.clientId,
        rotas: state.rotas
    })

    var rotaedShifts = _(state.rotaShifts).filter(function(shift){
        return shift.rota.clientId === rota.clientId && shift.staff_member.clientId === staffMember.clientId
    })

    var clockInEvents = _(state.clockInEvents).filter(function(clockInEvent){
        return clockInEvent.clock_in_day.clientId === clockInDay.clientId
    })

    var clockInNotes = _(state.clockInNotes).filter(function(clockInNote){
        return clockInNote.clock_in_day.clientId === clockInDay.clientId;
    })

    return {
        clockedClockInPeriods: clockInPeriods,
        hoursAcceptancePeriods: hoursAcceptancePeriods,
        clockInEvents,
        staffMember,
        rotaedShifts,
        clockInNotes
    }
}

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

export function selectIsForceClockingOutStaffMember(state, staffMemberClientId){
    return requestIsInProgressWithRequestData(
        state.apiRequestsInProgress.FORCE_STAFF_MEMBER_CLOCK_OUT,
    function(requestOptions){
        return requestOptions.staffMember.clientId == staffMemberClientId
    })
}
