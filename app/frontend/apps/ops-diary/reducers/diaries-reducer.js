import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import * as types from './types';

const initialState = fromJS([]);

export default handleActions(
  {
    [types.DIARIES_FETCH_SUCCEEDED]: (state, action) => {
      const { diaries } = action.payload;
      return fromJS(diaries);
    },
    [types.DIARY_CREATE_SUCCEEDED]: (state, action) => {
      return state.unshift(fromJS(action.payload));
    },
    [types.DIARY_UPDATE_SUCCEEDED]: (state, action) => {
      const updatedDiary = action.payload;
      return state.update(
        state.findIndex(item => item.get('id') === updatedDiary.id),
        item => fromJS(updatedDiary),
      );
    },
  },
  initialState,
);
