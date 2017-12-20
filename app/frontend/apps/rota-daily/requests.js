import axios from 'axios';
import http from '~/lib/request-api';

export const updateStaffMemberShiftRequest = (values) => {
  const {
    shift_id,
  } = values;
  return http({successMessage: 'Rota Shift Updated Successfully'}).patch(`/api/v1/rota_shifts/${shift_id}`, {
    ...values,
  });
};

export const deleteStaffMemberShiftRequest = (shift_id) => {

  return http({successMessage: 'Rota Shift Deleted Successfully'}).delete(`/api/v1/rota_shifts/${shift_id}`);
};

export const addShiftRequest = (values, venueId, rotaDate) => {

  return http({successMessage: 'Rota Shift Added Successfully'}).post(`/api/v1/venues/${venueId}/rotas/${rotaDate}/rota_shifts`, {
    ...values,
  });
};

export const setRotaStatusRequest = (status, venueId, rotaDate) => {
  if (!['in_progress', 'finished'].includes(status)) {
    throw Error('Wrong status');
  }
  return http().post(`/api/v1/venues/${venueId}/rotas/${rotaDate}/mark_${status}`);
};
