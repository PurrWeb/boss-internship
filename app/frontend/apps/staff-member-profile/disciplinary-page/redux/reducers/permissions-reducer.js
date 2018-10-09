import { handleActions, combineActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';
import * as types from '../types';

import { addDisciplinarySucceed, disableDisciplinarySucceed } from '../actions';

const initialState = Immutable.fromJS({
  disciplinariesTab: {
    canCreateDisciplinary: false,
    disciplinaries: {},
  },
});

const filterReducer = handleActions(
  {
    [types.LOAD_DISCIPLINARIES_SUCCEED]: (state, action) => {
      const permissionsData = oFetch(action, 'payload.permissionsData');
      return Immutable.fromJS(permissionsData);
    },
    [combineActions(addDisciplinarySucceed, disableDisciplinarySucceed)]: (state, action) => {
      const permissions = oFetch(action, 'payload.permissions');
      const id = oFetch(action, 'payload.disciplinary.id').toString();
      return state.updateIn(['disciplinariesTab', 'disciplinaries'], disciplinaries =>
        disciplinaries.set(id, Immutable.fromJS(permissions)),
      );
    },
  },
  initialState,
);

export default filterReducer;
