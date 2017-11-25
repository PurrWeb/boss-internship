import axios from 'axios';

export const changePasswordRequest = ({password, passwordConfirmation, verificationToken}) => {
  return axios.post('/api/v1/staff_members/set_password', {
    password,
    passwordConfirmation,
    verificationToken,
  });
}
