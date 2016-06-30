import _ from "underscore"
import utils from "~lib/utils"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import oFetch from "o-fetch"

// Just re-exporting here for now, later can either
// import directly from ./selectors/api-requests, or bulk export from here
import {
    selectEditHoursAcceptancePeriodIsInProgress,
    selectIsForceClockingOutClockInDay,
    selectAddClockInNoteIsInProgress,
    selectFetchWeeklyRotaIsInProgress,
    selectUpdateRotaForecastInProgress,
    selectClockInOutLoadAppDataIsInProgress,
    selectIsUpdatingStaffMemberStatus,
    selectEnterManagerModeIsInProgress,
    selectLeaveManagerModeIsInProgress,
    selectIsUpdatingStaffMemberPin,
    selectShiftIsBeingEdited,
    selectAddShiftIsInProgress
} from "./selectors/api-requests"
export {
    selectEditHoursAcceptancePeriodIsInProgress,
    selectIsForceClockingOutClockInDay,
    selectAddClockInNoteIsInProgress,
    selectFetchWeeklyRotaIsInProgress,
    selectUpdateRotaForecastInProgress,
    selectClockInOutLoadAppDataIsInProgress,
    selectIsUpdatingStaffMemberStatus,
    selectEnterManagerModeIsInProgress,
    selectLeaveManagerModeIsInProgress,
    selectIsUpdatingStaffMemberPin,
    selectShiftIsBeingEdited,
    selectAddShiftIsInProgress
}

import {
    selectStaffMemberCanEnterManagerMode,
    selectClockInOutAppIsInManagerMode,
    selectClockInOutAppUserPermissions,
    selectStaffMembersForClockInOutStaffFinder,
    selectRotaOnClockInOutPage
} from "./selectors/clock-in-out"
export {
    selectStaffMemberCanEnterManagerMode,
    selectClockInOutAppIsInManagerMode,
    selectClockInOutAppUserPermissions,
    selectStaffMembersForClockInOutStaffFinder,
    selectRotaOnClockInOutPage
}

import {
    selectClockInDay
} from "./selectors/clock-in-day"
export {
    selectClockInDay
}

import {
    selectShiftsByStaffMemberClientId
} from "./selectors/shifts"
export {
    selectShiftsByStaffMemberClientId
}

import {
    selectStaffMemberHolidays,
    selectStaffMemberUnpaidHolidays,
    selectStaffMemberPaidHolidays,
    selectStaffMemberIsOnHolidayOnDate
} from "./selectors/staff-members"
export {
    selectStaffMemberHolidays,
    selectStaffMemberUnpaidHolidays,
    selectStaffMemberPaidHolidays,
    selectStaffMemberIsOnHolidayOnDate
}

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
    var clockInDay = {...clockInDay}
    clockInDay.forceClockoutIsInProgress = selectIsForceClockingOutClockInDay(state, staffMember.clientId)

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
        var hasReason = hoursAcceptancePeriod.hours_acceptance_reason !== null;
        hoursAcceptancePeriod.hours_acceptance_reason =
            state.hoursAcceptanceReasons[hoursAcceptancePeriod.hours_acceptance_reason.clientId]
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
        var clockInPeriod = clockInEvent.clock_in_period.get(state.clockInPeriods)
        return clockInPeriod.clock_in_day.clientId === clockInDay.clientId
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
        clockInNotes,
        clockInDay
    }
}
