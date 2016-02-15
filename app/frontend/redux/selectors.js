import _ from "underscore"

export function selectStaffTypesWithShifts(state){
    var {rotaShifts, staff} = state;
    rotaShifts = _.values(rotaShifts.items);

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