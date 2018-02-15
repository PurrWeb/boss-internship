import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import * as types from './types';

const initialState = fromJS({
  isLoaded: false,
});

export default handleActions(
  {
    [types.DIARIES_FETCH_SUCCEEDED]: (state, action) => {
      const { page } = action.payload;
      return fromJS(page).set('isLoaded', true);
    },
  },
  initialState,
);
