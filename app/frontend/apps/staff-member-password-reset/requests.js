import axios from 'axios';

export const changePasswordRequest = ({password, passwordConfirmation, verificationToken}) => {
  return axios.post('/api/security_app/v1/sessions/set_password', {
    password,
    passwordConfirmation,
    verificationToken,
  });
}
