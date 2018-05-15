import http from '~/lib/request-api';
import oFetch from 'o-fetch';

export const updateStaffMemberShiftRequest = values => {
  const { shiftId } = values;
  return http({ successMessage: 'Rota Shift Updated Successfully' }).patch(`/api/v1/security-rota-shifts/${shiftId}`, {
    ...values,
  });
};

export const updateSecurityVenueShiftRequest = values => {
  const { shiftId } = values;
  return http({ successMessage: 'Security Venue Shift Updated Successfully' }).patch(`/api/v1/security-venue-shifts/${shiftId}`, {
    ...values,
  });
};

export const deleteStaffMemberShiftRequest = shiftId => {
  return http({ successMessage: 'Rota Shift Deleted Successfully' }).delete(`/api/v1/security-rota-shifts/${shiftId}`);
};

export const addShiftRequest = (values, rotaDate) => {
  return http({ successMessage: 'Rota Shift Added Successfully' }).post(`/api/v1/security-rota-shifts`, {
    ...values,
    rotaDate,
  });
};

export const addSecurityVenueShiftRequest = (values, rotaDate) => {
  return http({ successMessage: 'Security Venue Shift Added Successfully' }).post(`/api/v1/security-venue-shifts`, {
    ...values,
    rotaDate,
  });
};

export const disableSecurityVenueShiftRequest = securityVenueShiftId => {
  return http({ successMessage: 'Security Venue Shift Disabled Successfully' }).delete(`/api/v1/security-venue-shifts/${securityVenueShiftId}`);
};
