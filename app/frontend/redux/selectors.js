import _ from "underscore"
import utils from "~lib/utils"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"

export function selectStaffTypesWithShifts(state){
    var {rotaShifts, staff} = state;
    rotaShifts = _.values(rotaShifts);

    var allStaffTypes = state.staffTypes;
    var shiftStaffTypes = _(rotaShifts).map(getStaffTypeFromShift);
    var staffTypes = _(allStaffTypes).filter(function(staffType){
        return _(shiftStaffTypes).contains(staffType.id);
    });
    return _(staffTypes).indexBy("id");

    function getStaffTypeFromShift(shift) {
        return staff[shift.staff_member.id].staff_type.id;
    }
}

export function selectStaffMemberHolidays(state, staffId){
    var staffMember = state.staff[staffId];
    var staffMemberHolidayIds = _.pluck(state.staff[staffId].holidays, "id");
    var allHolidays = staffMemberHolidayIds.map(function(id){
        return state.holidays[id];
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

export function selectUpdateRotaForecastInProgress(state, {venueId, dateOfRota}){
    var updatesInProgress = state.apiRequestsInProgress.UPDATE_ROTA_FORECAST;
    return !_.isEmpty(_(updatesInProgress).filter(function(update){
        var isSameDate = utils.datesAreEqual(update.dateOfRota, dateOfRota);
        var isSameVenue = venueId === update.venueId;
        return isSameVenue && isSameDate;
    }))
}

export function selectForecastByRotaId(state, rotaId){
    var rota = state.rotas[rotaId];
    return _(state.rotaForecasts).find(function(forecast){
        var isSameDate = utils.datesAreEqual(rota.date, forecast.date);
        var isSameVenue = rota.venue.id === forecast.venue.id;
        return isSameVenue && isSameDate;
    })
}

export function selectAddShiftIsInProgress(state, staffId){
    var shiftsBeingAdded = state.apiRequestsInProgress.ADD_SHIFT;
    return _(shiftsBeingAdded).some(
        (request) => request.shift.staff_member_id === staffId
    );
}

export function selectRotaOnVenueRotaPage(state){
    return getRotaFromDateAndVenue(
        state.rotas,
        state.pageOptions.dateOfRota,
        state.pageOptions.venueId
    );
}