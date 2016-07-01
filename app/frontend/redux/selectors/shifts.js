import _ from "underscore"

export function selectShiftsByStaffMemberClientId(state, staffMemberClientId){
    return _(state.rotaShifts).filter(function(shift){
        return shift.staff_member.clientId === staffMemberClientId
    });
}
