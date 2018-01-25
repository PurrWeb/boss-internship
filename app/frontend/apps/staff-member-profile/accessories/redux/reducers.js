import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';

import * as constants from './constants';

const initialState = fromJS({
  accessories: [],
  accessoryRequests: [],
});

const accessoriesReducer = handleActions(
  {
    [constants.LOAD_INITIAL_STATE]: (state, action) => {
      const { accessToken, accessories, accessoryRequests } = action.payload;

      window.boss.accessToken = accessToken;

      return state
        .setIn(['accessories'], fromJS(accessories))
        .setIn(['accessoryRequests'], fromJS(accessoryRequests));
    },
    [constants.ADD_ACCESSORY]: (state, action) => {
      const newAccessory = action.payload;

      return state.updateIn(['accessoryRequests'], requests => {
        return requests.push(fromJS(newAccessory));
      });
    },
  },
  initialState,
);

export default accessoriesReducer;
