import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';
import * as constants from '../../constants';
import * as types from '../types';

const initialState = Immutable.fromJS({
  startDate: null,
  endDate: null,
  show: [],
});

const filterReducer = handleActions(
  {
    [types.LOAD_DISCIPLINARIES_SUCCEED]: (state, action) => {
      const startDate = oFetch(action, 'payload.filter.start_date');
      const endDate = oFetch(action, 'payload.filter.end_date');
      const expired = oFetch(action, 'payload.filter.show_expired');
      const disabled = oFetch(action, 'payload.filter.show_disabled');
      const show = [expired && constants.EXPIRED, disabled && constants.DISABLED].filter(value => value);
      return Immutable.fromJS({ startDate, endDate, show });
    },
  },
  initialState,
);

export default filterReducer;
