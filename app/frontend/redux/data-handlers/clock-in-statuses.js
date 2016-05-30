import makeDataHandler from "./make-data-handler"

export default makeDataHandler("clockInStatuses",{
    REPLACE_ALL_CLOCK_IN_STATUSES: {
        action: "replaceAll"
    },
    UPDATE_STAFF_STATUS_SUCCESS: function(state, action){
        return updateStaffMemberStatus(
            state,
            action.staffMemberObject.clientId,
            action.statusValue
        );
    },
    FORCE_STAFF_MEMBER_CLOCK_OUT_SUCCESS: function(state, action){
        return updateStaffMemberStatus(
            state,
            action.staffMember.clientId,
            action.status
        )
    }
})

function updateStaffMemberStatus(state, staffMemberClientId, newStatus){
    var newStatusObject = state[staffMemberClientId];
    newStatusObject = Object.assign({}, newStatusObject, {
        status: newStatus
    })
    return Object.assign({}, state, {
        [staffMemberClientId]: newStatusObject
    });
}
