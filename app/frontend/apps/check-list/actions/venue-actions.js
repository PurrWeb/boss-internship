import axios from 'axios';
import {
  CHANGE_VENUE,
  FILL_CHECKLISTS_DATA,
} from '../constants/action-names';

export const changeVenue = (venue) => (dispatch, getState) => {
  const accessToken = getState().get('accessToken');
  axios.get('/api/v1/check_lists', {
    params: {
        venue_id: venue.id
    },
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch(fillChecklists(resp.data));
  });
}

export const fillChecklists = (data) => {
  return {
    type: FILL_CHECKLISTS_DATA,
    payload: data,
  }
}
