import axios from 'axios';
import {
  CHANGE_VENUE,
  FILL_CHECKLISTS_DATA,
} from '../constants/action-names';

export const changeVenue = (venue) => (dispatch, getState) => {
  const accessToken = getState().getIn(['checklists', 'accessToken']);
  axios.get('/api/v1/check_lists', {
    params: {
        venue_id: venue.id
    },
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch(fillChecklists(resp.data));
    window.history.pushState('state', 'title', `check_lists?venue_id=${venue.id}`);
  });
}

export const fillChecklists = (data) => {
  return {
    type: FILL_CHECKLISTS_DATA,
    payload: data,
  }
}
