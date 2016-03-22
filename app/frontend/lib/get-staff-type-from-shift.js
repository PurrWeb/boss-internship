export default function getStaffTypeFromShift({shift, staffTypesById, staffMembersById}){
    var staffMemberObject = shift.staff_member.get(staffMembersById);
    return staffMemberObject.staff_type.get(staffTypesById);
}