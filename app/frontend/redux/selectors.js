export function selectStaffTypesWithShifts(state){
    var {rotaShifts, staff} = state;

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