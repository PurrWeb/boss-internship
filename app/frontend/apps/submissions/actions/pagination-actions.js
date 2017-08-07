import axios from 'axios';
import {
  CHANGE_PAGE,
} from '../constants/action-names';

import {search} from './filter-actions';

export const changePage = (page) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_PAGE,
    payload: page,
  });
  dispatch(search());
}

export const fillSubmitions = (data) => {
  return {
    type: FILL_SUBMISSIONS_DATA,
    payload: data,
  }
}

