import oFetch from 'o-fetch';
import {
  changePasswordRequest,
} from './requests';


export const changePassword = (values) => (dispatch, getState) => {
  const successPath = oFetch(values, 'successPath');
  const requestPath = oFetch(values, 'requestPath');
  const password = oFetch(values, 'password');
  const passwordConfirmation = oFetch(values, 'passwordConfirmation');
  const verificationToken = oFetch(values, 'verificationToken');

  return changePasswordRequest({requestPath, password, passwordConfirmation, verificationToken}).then(resp => {
    window.location = successPath;
  })
}
