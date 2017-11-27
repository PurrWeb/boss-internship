import axios from 'axios';

export const signInRequest = (email, password) => {
  return axios.post('/api/security_app/v1/sessions/sign_in', {
    email,
    password
  });
}
