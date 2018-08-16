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

export const loadInitialDataRequest = ({ venueId, accessoriesFilter, currentPage }) => {
  return http({
    successMessage: 'Success',
    globalLoader: true,
    notify: false,
  }).get('/api/v1/accessories', {
    params: {
      venueId,
      page: currentPage,
      ...accessoriesFilter,
    },
  });
};

export const createAccessoryRequest = ({ venueId, values }) => {
  return http().post('/api/v1/accessories', {
    venueId,
    ...values,
  });
};

export const updateAccessoryRequest = ({ venueId, values }) => {
  return http().put(`/api/v1/accessories/${values.id}`, {
    venueId,
    ...values,
  });
};

export const disableAccessoryRequest = ({ venueId, accessoryId }) => {
  return http().delete(`/api/v1/accessories/${accessoryId}`, {
    params: {
      venueId,
    },
  });
};

export const restoreAccessoryRequest = ({ venueId, accessoryId }) => {
  return http().post(`/api/v1/accessories/${accessoryId}/restore`, {
    venueId,
  });
};

export const updateAccessoryFreeItemsRequest = ({ venueId, accessoryId, freeItemsCount }) => {
  return http().put(`/api/v1/accessories/${accessoryId}/update_free_items`, {
    venueId,
    freeItemsCount,
  });
};
