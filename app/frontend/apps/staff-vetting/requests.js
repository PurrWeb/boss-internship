import http from './http';

export const getStaffMembersWithoutAddress = () => {
  return http({ notify: false, globalLoader: true }).get(
    `/api/v1/staff_vetting/staff-without-address`,
  );
};

export const getStaffMembersWithoutNINumber = () => {
  return http({ notify: false, globalLoader: true }).get(
    `/api/v1/staff_vetting/staff-without-ni-number`,
  );
};

export const getStaffMembersWithoutEmail = () => {
  return http({ notify: false, globalLoader: true }).get(
    `/api/v1/staff_vetting/staff-without-email`,
  );
};

export const getStaffMembersWithoutPhoto = () => {
  return http({ notify: false, globalLoader: true }).get(
    `/api/v1/staff_vetting/staff-without-photo`,
  );
};

export const getStaffMembersWithExpiredSIABadge = () => {
  return http({ notify: false, globalLoader: true }).get(
    `/api/v1/staff_vetting/staff-with-expired-sia-badge`,
  );
};

export const getStaffMembersOnWrongPayrate = () => {
  return http({ notify: false, globalLoader: true }).get(
    `/api/v1/staff_vetting/staff-on-wrong-payrate`,
  );
};

export const getStaffMembersWithBouncedEmails = () => {
  return http({ notify: false, globalLoader: true }).get(
    `/api/v1/staff_vetting/staff-with-bounced-email`,
  );
};

export const getStaffMembersWithTimeDodges = (date) => {

  const data = date[0] % 2 === 0 
    ? require('./fixtures.json') 
    : require('./fixtures-short.json')

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
      data,
      })
    }, 1000)
  })
};

