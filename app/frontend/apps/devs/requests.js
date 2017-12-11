import http from './request-api';

export const initRequest = (auth) => {
  return http({successMessage: 'Initial data received successful'}, auth).then(instance => {
    return instance.get('/api/security-app/v1/init', {});
  });
}
