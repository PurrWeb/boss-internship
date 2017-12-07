import axios from 'axios';

export const signInRequest = (email, password) => {
  return axios.post('/api/security-app/v1/sessions/new', {
    username: email,
    password: password
  });
}

export const initRequest = (token) => {
 return axios.
  create({
    headers: {'Authorization': `Token token="${token}"`}
  }).
  get('/api/security-app/v1/init', {});
}
