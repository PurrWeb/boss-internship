import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import * as types from './types';

const initialState = fromJS([]);

export default handleActions(
  {
    [types.DIARIES_FETCH_SUCCEEDED]: (state, action) => {
      const { users } = action.payload;
      return fromJS(users);
    },
  },
  initialState,
);
