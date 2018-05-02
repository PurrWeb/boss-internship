import http from '~/lib/request-api';

export const addVenueRequest = values => {
  return http({ successMessage: 'Venue Added Successfully' }).post(
    `/api/v1/`,
    {
      ...values,
    },
  );
};

export const updateVenueRequest = values => {
  return http({ successMessage: 'Venue Updated Successfully' }).post(
    `/api/v1/`,
    {
      ...values,
    },
  );
};
