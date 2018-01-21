import axios from 'axios';
import oFetch from 'o-fetch'

export const changePasswordRequest = (options) => {
  const requestPath = oFetch(options, 'requestPath');
  const password = oFetch(options, 'password');
  const passwordConfirmation = oFetch(options, 'passwordConfirmation');
  const verificationToken = oFetch(options, 'verificationToken');

  return axios.post(requestPath, {
    password,
    passwordConfirmation,
    verificationToken,
  });
}
