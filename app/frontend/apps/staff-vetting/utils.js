export const selectStaffMembersByStaffType = (staffMembers, staffTypeId) => {
  return staffMembers.filter(staffMember => staffMember.get('staffTypeId') === staffTypeId);
};

export const selectStaffMembersByVenue = (staffMembers, venueId) => {
  return staffMembers.filter(staffMember => staffMember.get('venueId') === venueId);
};

export const selectSecurityStaffMembers = staffMembers => {
  return staffMembers.filter(staffMember => staffMember.get('isSecurityStaff'));
};
