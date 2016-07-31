import _ from "underscore"
import {createSelector} from "reselect"

var rotaShiftsSelector = state => state.rotaShifts;

var groupAllShiftsByStaffMemberClientId = createSelector(
    rotaShiftsSelector,
    function(rotaShifts){
        var res = {}
        _(rotaShifts).each(function(shift){
            var staffMemberClientId = shift.staff_member.clientId;
            if (!res[staffMemberClientId]) {
                res[staffMemberClientId] = []
            }
            res[staffMemberClientId].push(shift)
        });
        return res;
    }
)

var emptyList = []
var selectShiftsByStaffMemberClientId = function(state, staffMemberClientId){
    var res = groupAllShiftsByStaffMemberClientId(state)[staffMemberClientId]
    if (res === undefined) {
        res = emptyList
    }
    return res
}

export {selectShiftsByStaffMemberClientId}
