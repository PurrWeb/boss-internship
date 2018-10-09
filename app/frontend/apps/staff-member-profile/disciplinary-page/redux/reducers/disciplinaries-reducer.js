import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.List();

const disciplinariesReducer = handleActions(
  {
    [types.LOAD_DISCIPLINARIES_SUCCEED]: (state, action) => {
      const disciplinaries = oFetch(action, 'payload.disciplinaries');
      return Immutable.fromJS(disciplinaries);
    },
    [types.ADD_DISCIPLINARY_SUCCEED]: (state, action) => {
      const disciplinary = oFetch(action, 'payload.disciplinary');
      return state.push(Immutable.fromJS(disciplinary));
    },
    [types.DISABLE_DISCIPLINARY_SUCCEED]: (state, action) => {
      const disciplinary = oFetch(action, 'payload.disciplinary');
      const isShowDisabled = oFetch(action, 'payload.isShowDisabled');
      const disciplinaryId = oFetch(disciplinary, 'id');
      const disciplinaryIndex = state.findIndex(item => item.get('id') === disciplinaryId);
      if (isShowDisabled) {
        return state.update(disciplinaryIndex, d => Immutable.fromJS(disciplinary));
      } else {
        return state.delete(disciplinaryIndex);
      }
    },
  },
  initialState,
);

export default disciplinariesReducer;
