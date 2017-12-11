import { httpWithGlobalNotifications } from './request-api';

export const initRequest = (auth) => {
  return httpWithGlobalNotifications(auth, {successMessage: 'Initial data received successfully'}).get('/api/security-app/v1/init', {});
}

export const sendTestRequest = (auth) => {
  return httpWithGlobalNotifications(auth, {successMessage: 'Test request successful'}).get('/api/security-app/v1/tests/get');
}