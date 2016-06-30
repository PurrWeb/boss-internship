import _ from "underscore"
import {
    selectIsUpdatingStaffMemberStatus,
    selectIsUpdatingStaffMemberPin,
    selectEnterManagerModeIsInProgress
} from "./api-requests"

export function selectStaffMembers(state){
    return _.mapObject(state.staffMembers, function(staffMember){
        staffMember = {...staffMember}

        var staffTypeObject = staffMember.staff_type.get(state.staffTypes);
        staffMember.staffType = staffTypeObject;

        staffMember.isManager = staffTypeObject.name === "Manager";
        staffMember.isSupervisor = staffTypeObject.name === "Bar Supervisor";
        staffMember.isGeneralManager = staffTypeObject.name === "GM";

        staffMember.updateStatusInProgress = selectIsUpdatingStaffMemberStatus(state, {
            staffMemberServerId: staffMember.serverId
        });
        staffMember.updatePinInProgress = selectIsUpdatingStaffMemberPin(state, {
            staffMemberServerId: staffMember.serverId
        });
        staffMember.enterManagerModeInProgress = selectEnterManagerModeIsInProgress(state, {
            staffMemberServerId: staffMember.serverId
        });

        return staffMember
    })
}
