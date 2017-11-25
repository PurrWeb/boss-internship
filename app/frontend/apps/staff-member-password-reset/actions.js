import {
  changePasswordRequest,
} from './requests';


export const changePassword = (values) => (dispatch, getState) => {
  const {password, passwordConfirmation, verificationToken} = values;
  return changePasswordRequest({password, passwordConfirmation, verificationToken}).then(resp => {
    window.location = '/staff_members/set_password/success';
  })
}
