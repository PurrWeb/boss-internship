import http from './http';

export const getStaffMembersWithoutAddress = () => {
  return http({ notify: false, globalLoader: true }).get(`/api/v1/staff_vetting/staff-without-address`);
};

export const loadDisciplinariesRequest = ({ staffMemberId, queryString }) => {
  return http({ notify: false, globalLoader: true }).get(
    `/api/v1/staff_members/${staffMemberId}/disciplinaries${queryString}`,
  );
};

export const addDisciplinaryRequest = ({ staffMemberId, ...rest }) => {
  return http({ notify: false, globalLoader: false }).post(`/api/v1/staff_members/${staffMemberId}/disciplinaries`, {
    ...rest,
  });
};

export const disableDisciplinaryRequest = ({ staffMemberId, disciplinaryId }) => {
  return http({ notify: false, globalLoader: false }).delete(
    `/api/v1/staff_members/${staffMemberId}/disciplinaries/${disciplinaryId}`,
  );
};
