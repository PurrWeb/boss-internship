import axios from 'axios';
import globalNotification from '~/components/global-notification';

export default function http({ ...params }) {
  const instance = axios.create();
  instance.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;

  const { successMessage, errorMessage, interval, notify, globalLoader } = params;

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

export const loadDataRequest = ({ venueId, accessoriesFilter, currentPage }) => {
  return http({
    globalLoader: true,
    notify: false,
  }).get('/api/v1/accessory-requests', {
    params: {
      venueId,
      page: currentPage,
      ...accessoriesFilter,
    },
  });
};

export const acceptAccessoryRequestRequest = ({ venueId, accessoryId, requestId }) => {
  return http().post(`/api/v1/accessory-requests/${requestId}/accept`, {
    venueId,
    accessoryId,
  });
};

export const undoAccessoryRequestRequest = ({ venueId, accessoryId, requestId }) => {
  return http().post(`/api/v1/accessory-requests/${requestId}/undo`, {
    venueId,
    accessoryId,
  });
};

export const rejectAccessoryRequestRequest = ({ venueId, accessoryId, requestId }) => {
  return http().post(`/api/v1/accessory-requests/${requestId}/reject`, {
    venueId,
    accessoryId,
  });
};

export const acceptAccessoryRefundRequestRequest = ({ venueId, accessoryId, requestId }) => {
  return http().post(`/api/v1/accessory-requests/${requestId}/accept-refund`, {
    venueId,
    accessoryId,
  });
};

export const undoAccessoryRefundRequestRequest = ({ venueId, accessoryId, requestId }) => {
  return http().post(`/api/v1/accessory-requests/${requestId}/undo-refund`, {
    venueId,
    accessoryId,
  });
};

export const rejectAccessoryRefundRequestRequest = ({ venueId, accessoryId, requestId }) => {
  return http().post(`/api/v1/accessory-requests/${requestId}/reject-refund`, {
    venueId,
    accessoryId,
  });
};

export const completeAccessoryRequestRequest = ({ venueId, accessoryId, requestId }) => {
  return http().post(`/api/v1/accessory-requests/${requestId}/complete`, {
    venueId,
    accessoryId,
  });
};

export const completeAccessoryRefundRequestRequest = ({ venueId, accessoryId, requestId, reusable }) => {
  return http().post(`/api/v1/accessory-requests/${requestId}/complete-refund`, {
    venueId,
    accessoryId,
    reusable,
  });
};
