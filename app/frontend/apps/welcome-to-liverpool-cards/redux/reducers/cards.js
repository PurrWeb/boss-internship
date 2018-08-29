import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.List();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const cards = oFetch(action, 'payload.cards');
      return Immutable.fromJS(cards);
    },
    [types.ENABLE_CARD]: (state, action) => {
      const card = oFetch(action, 'payload.card');
      const cardNumber = oFetch(card, 'number');
      const disabled = oFetch(card, 'disabled');
      const cardIndex = state.findIndex(card => card.get('number') === cardNumber);
      return state.update(cardIndex, card => card.set('disabled', disabled));
    },
    [types.DISABLE_CARD]: (state, action) => {
      const card = oFetch(action, 'payload.card');
      const cardNumber = oFetch(card, 'number');
      const disabled = oFetch(card, 'disabled');
      const cardIndex = state.findIndex(card => card.get('number') === cardNumber);
      return state.update(cardIndex, card => card.set('disabled', disabled));
    },
  },
  initialState,
);
