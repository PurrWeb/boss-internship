import axios from 'axios';
import notify from '~/components/global-notification';

function getInstance() {
  if (!window.boss.accessToken) {
    throw Error('Access token must be present !!!');
  }

  return axios.create({
    headers: { Authorization: `Token token="${window.boss.accessToken}"` },
  });
}

export function httpWithoutNotify() {
  return getInstance();
}

export default function http({...messages}, interval) {
  const { successMessage, errorMessage, showNotification = true } = messages;

  const instance = getInstance();

  if (showNotification) {
    instance.interceptors.response.use(
      function(response) {
        // Do something with response data
        notify(successMessage || 'Action was successful', {
          interval: interval,
          status: 'success',
        });

        return response;
      },
      function(error) {
        // Do something with response error
        let baseErrorFromResponse;
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.errors &&
          error.response.data.errors.base
        ) {
          baseErrorFromResponse = error.response.data.errors.base[0];
        }
        notify(errorMessage || baseErrorFromResponse || 'There was an error', {
          interval: interval,
          status: 'error',
        });

        return Promise.reject(error);
      },
    );
  }

  return instance;
}
