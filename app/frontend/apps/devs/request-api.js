import axios from 'axios';
import globalNotification from '~/components/global-notification';

export function authenticatedHttp(authService, {...params}) {
  const {notify, interval } = params;
  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use(function (config) {
    return authService.getToken().then(token => {
      config.headers.Authorization = `Token token="${token}"`;
      return config;
    })
  }, function (error) {
    return Promise.reject(error);
  });

  return axiosInstance;
};

export function httpWithGlobalNotifications(authService, params){
  const successMessage = params.successMessage;
  const errorMessage = params.errorMessage;
  const interval = params.interval || 5000;

  const httpFactoryParams = _.omit(params, ['successMessage', 'errorMessage', 'interval']);
  const authenticatedHttpInstance = authenticatedHttp(authService, httpFactoryParams);

  authenticatedHttpInstance.interceptors.response.use(
    function (response) {
      //Success
      globalNotification(successMessage || 'Action was successful', {
        interval: interval,
        status: 'success'
      });

      return response;
    }, function (resp) {
      //Error
      let baseErrors = null;

      if (resp.response.data.errors) {
        if (resp.response.data.errors.base) {
          baseErrors = resp.response.data.errors.base.join(', ');
        }
      }

      let defaultMessage = "There was an error";
      if(baseErrors){
        defaultMessage = defaultMessage + baseErrors
      }

      globalNotification(errorMessage || defaultMessage , {
        interval: interval,
        status: 'error'
      });

      return Promise.reject(resp);
    }
  );

  return authenticatedHttpInstance;
}