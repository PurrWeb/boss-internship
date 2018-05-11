import http from '~/lib/request-api';

export const addVenueRequest = values => {
  return http({ successMessage: 'Security Venue Added Successfully' }).post(`/api/v1/security_venues`, {
    ...values,
  });
};

export const updateSecurityVenueRequest = ({ id, ...values }) => {
  return http({ successMessage: 'Security Venue Updated Successfully' }).put(
    `/api/v1/security_venues/${id}`,
    {
      ...values,
    },
  );
};
