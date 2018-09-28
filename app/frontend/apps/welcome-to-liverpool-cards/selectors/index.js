import { createSelector } from 'reselect';
import queryString from 'query-string';

import { ALL } from '../constants';
export const clientsSelector = state => state.get('clients');
export const cardsSelector = state => state.get('cards');
export const activeFilterSelector = state => state.getIn(['filter', 'activeFilter']);
export const numberFilterSelector = state => state.getIn(['filter', 'numberFilter']);

export const ALLOWED_FILTER_KEYS = ['cardNumber'];

export const getWtlCardsFilterQueryParams = () => {
  const query = location.search;
  const parsedQueryString = queryString.parse(query);

  return Object.keys(parsedQueryString).reduce((acc, item) => {
    if (ALLOWED_FILTER_KEYS.includes(item)) {
      return { ...acc, [item]: parsedQueryString[item] };
    }
    return acc;
  }, {});
};

export const getCardsWithClients = createSelector(clientsSelector, cardsSelector, (clients, cards) => {
  return cards.map(card => {
    const client = clients.find(client => client.get('cardNumber') === card.get('number'));
    const fullName = client ? client.get('fullName') : null;
    return card.set('fullName', fullName);
  });
});

export const getFilteredCardsByActive = createSelector(
  getCardsWithClients,
  activeFilterSelector,
  (cards, activeFilter) => {
    if (activeFilter === ALL) {
      return cards;
    } else {
      return cards.filter(card => card.get('disabled') === false);
    }
  },
);

export const getFilteredCardsByNumber = createSelector(
  getFilteredCardsByActive,
  numberFilterSelector,
  (cards, numberFilter) => {
    if (!numberFilter) {
      return cards;
    } else {
      return cards.filter(card =>
        card
          .get('number')
          .toString()
          .includes(numberFilter),
      );
    }
  },
);

export const getFilteredCards = getFilteredCardsByNumber;
