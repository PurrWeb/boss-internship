import axios from 'axios';
import globalNotification from '~/components/global-notification';

async function http({...params}, auth) {
  const {successMessage, errorMessage, interval, notify} = params;
  let instance = null;
  if (auth) {
    const token = await auth.getToken();
    instance = axios.create({
      headers: {'Authorization': `Token token="${token}"`}
    });
  } else {
    instance = axios.create();
  }

  if (notify !== false) {
    instance.interceptors.response.use(function (response) {
      // Do something with response data
      globalNotification(successMessage || 'Action was successful', {
        interval: interval,
        status: 'success'
      });

      return response;
    }, function (resp) {
      // Do something with response error
      let error = null;

      if (resp.response.data.errors) {
        if (resp.response.data.errors.base) {
          error = resp.response.data.errors.base.join(', ');
        }
      }

      globalNotification(errorMessage || error || 'There was an error', {
        interval: interval,
        status: 'error'
      });

      return Promise.reject(resp);
    });
  }

  return instance;
};

export default http;
