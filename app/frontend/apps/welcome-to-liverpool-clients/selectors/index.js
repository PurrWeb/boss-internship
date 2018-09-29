import { createSelector } from 'reselect';
import queryString from 'query-string';
import utils from '~/lib/utils';
import { VALIDATED, PENDING_VALIDATION } from '../constants';

export const ALLOWED_FILTER_KEYS = ['name', 'email', 'status', 'cardNumber'];

export const getWtlClientsFilterQueryParams = () => {
  const query = location.search;
  const parsedQueryString = queryString.parse(query);

  return Object.keys(parsedQueryString).reduce((acc, item) => {
    if (ALLOWED_FILTER_KEYS.includes(item)) {
      return { ...acc, [item]: parsedQueryString[item] };
    }
    return acc;
  }, {});
};

export const clientsSelector = state => state.get('clients');
export const nameFilterSelector = state => state.getIn(['filter', 'nameFilter']);
export const emailFilterSelector = state => state.getIn(['filter', 'emailFilter']);
export const statusFilterSelector = state => state.getIn(['filter', 'statusFilter']);
export const cardNumberFilterSelector = state => state.getIn(['filter', 'cardNumberFilter']);

export const clientIdSelector = (state, props) => props.clientId;

export const getClientById = createSelector(clientsSelector, clientIdSelector, (clients, clientId) => {
  return clients.find(client => client.get('id').toString() === clientId.toString());
});

export const getClients = createSelector(clientsSelector, clients => {
  return clients;
});

export const getFilteredClients = getClients;
