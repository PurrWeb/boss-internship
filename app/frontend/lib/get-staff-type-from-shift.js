export default function getStaffTypeFromShift({shift, staffTypesById, staffMembersById}){
    var staffMemberObject = staffMembersById[shift.staff_member.id];
    var staffTypeId = staffMemberObject.staff_type.id;
    return staffTypesById[staffTypeId];
}