import http from '~/lib/request-api';

export const updateStaffMemberShiftRequest = values => {
  const { shiftId } = values;
  return http({ successMessage: 'Rota Shift Updated Successfully' }).patch(
    `/api/v1/security-rota-shifts/${shiftId}`,
    {
      ...values,
    },
  );
};

export const deleteStaffMemberShiftRequest = shiftId => {
  return http({ successMessage: 'Rota Shift Deleted Successfully' }).delete(
    `/api/v1/security-rota-shifts/${shiftId}`,
  );
};

export const addShiftRequest = (values, rotaDate) => {
  return http({ successMessage: 'Rota Shift Added Successfully' }).post(
    `/api/v1/security-rota-shifts`,
    {
      ...values,
      rotaDate,
    },
  );
};
