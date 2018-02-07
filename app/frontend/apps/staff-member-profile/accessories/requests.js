import axios from 'axios';
import globalNotification from '~/components/global-notification';
import oFetch from 'o-fetch';

export default function http({ ...params }) {
  const instance = axios.create();
  instance.defaults.headers.common['Authorization'] = `Token token="${
    window.boss.accessToken
  }"`;

  const {
    successMessage,
    errorMessage,
    interval,
    notify,
    globalLoader,
  } = params;

  let loader;

  if (globalLoader === true) {
    instance.interceptors.request.use(
      config => {
        const bodyFirst = document.body.firstChild;
        loader = document.createElement('div');
        bodyFirst.parentNode.insertBefore(loader, bodyFirst);
        loader.classList.add('loading');
        return config;
      },
      error => {
        loader.remove();
        return Promise.reject(error);
      },
    );
    instance.interceptors.response.use(
      config => {
        loader.remove();
        return config;
      },
      error => {
        loader.remove();
        return Promise.reject(error);
      },
    );
  }

  if (notify !== false) {
    instance.interceptors.response.use(
      response => {
        globalNotification(successMessage || 'Action was successful', {
          interval: interval,
          status: 'success',
        });
        return response;
      },
      error => {
        globalNotification(errorMessage || 'There was an error', {
          interval: interval,
          status: 'error',
        });

        return Promise.reject(error);
      },
    );
  }

  return instance;
}

export const newAccessoryRequest = (staffMemberId, values) => {
  return http().post(
    `/api/v1/staff_members/${staffMemberId}/accessory-requests`,
    {
      ...values,
    },
  );
};

export const cancelAccessoryRequest = (staffMemberId, accessoryRequestId) => {
  return http().post(
    `/api/v1/staff_members/${staffMemberId}/accessory-requests/${accessoryRequestId}/cancel`,
  );
};

export const refundAccessoryRequest = (staffMemberId, accessoryRequestId) => {
  return http().post(
    `/api/v1/staff_members/${staffMemberId}/accessory-requests/${accessoryRequestId}/refund`,
  );
};
