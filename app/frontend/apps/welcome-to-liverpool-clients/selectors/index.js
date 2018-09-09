import { createSelector } from 'reselect';
import utils from '~/lib/utils';
import { VALIDATED, PENDING_VALIDATION } from '../constants';

export const clientsSelector = state => state.get('clients');
export const nameFilterSelector = state => state.getIn(['filter', 'nameFilter']);
export const emailFilterSelector = state => state.getIn(['filter', 'emailFilter']);
export const statusFilterSelector = state => state.getIn(['filter', 'statusFilter']);
export const cardNumberFilterSelector = state => state.getIn(['filter', 'cardNumberFilter']);

export const clientIdSelector = (state, props) => props.clientId;

export const getClientById = createSelector(clientsSelector, clientIdSelector, (clients, clientId) => {
  return clients.find(client => client.get('id').toString() === clientId.toString());
});

export const getClientsFilteredByName = createSelector(clientsSelector, nameFilterSelector, (clients, name) => {
  if (name) {
    return utils.staffMemberFilterFullName(name, clients);
  }
  return clients;
});

export const getClientsFilteredByEmail = createSelector(
  getClientsFilteredByName,
  emailFilterSelector,
  (clients, email) => {
    if (email) {
      return clients.filter(client => client.get('email').includes(email));
    }
    return clients;
  },
);

export const getClientsFilteredByStatus = createSelector(
  getClientsFilteredByEmail,
  statusFilterSelector,
  (clients, status) => {
    if (status && status === VALIDATED) {
      return clients.filter(client => client.get('emailVerified'));
    }
    if (status && status === PENDING_VALIDATION) {
      return clients.filter(client => !client.get('emailVerified'));
    }
    return clients;
  },
);

export const getClientsFilteredByNumber = createSelector(
  getClientsFilteredByStatus,
  cardNumberFilterSelector,
  (clients, cardNumber) => {
    if (cardNumber) {
      return clients.filter(client =>
        client
          .get('cardNumber')
          .toString()
          .includes(cardNumber),
      );
    }
    return clients;
  },
);

export const getFilteredClients = getClientsFilteredByNumber;
