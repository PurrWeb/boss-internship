import { fromJS, Map, List } from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch'

import {
  INITIAL_LOAD,
  EDIT_PROFILE,
  CANCEL_EDIT_PROFILE,
  ENABLE_PROFILE,
  CANCEL_ENABLE_PROFILE,
  SHOW_DISABLE_MODAL,
  HIDE_DISABLE_MODAL,
  SHOW_EDIT_AVATAR_MODAL,
  HIDE_EDIT_AVATAR_MODAL,
  UPDATE_STAFF_MEMBER,
} from './constants';

const initialState = fromJS({
  staffMember: {},
  accessToken: null,
  editProfile: false,
  enableProfile: false,
  staffTypes: [],
  venues: [],
  payRates: [],
  disableStaffMemberModal: false,
  editAvatarModal: false,
});

const profileReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const {
      staffMember,
      accessToken,
      staffTypes,
      venues,
      payRates,
      genderValues,
      accessibleVenueIds,
      accessiblePayRateIds,
    } = action.payload;

    return state
      .set('staffMember', fromJS(staffMember))
      .set('accessToken', fromJS(accessToken))
      .set('staffTypes', fromJS(staffTypes))
      .set('venues', fromJS(venues))
      .set('payRates', fromJS(payRates))
      .set('genderValues', fromJS(genderValues))
      .set('accessiblePayRates', accessiblePayRateIds.map(id => {
        return payRates.find(payRate => {
          return oFetch(payRate, 'id') === id
        })
      }))
      .set('accessibleVenues', accessibleVenueIds.map(id => {
        return venues.find(venue => {
          return oFetch(venue, 'id') === id
        })
      }));
  },
  [UPDATE_STAFF_MEMBER]: (state, action) => {
    const staffMember = action.payload;
    return state
      .set('staffMember', fromJS(staffMember))
  },
  [EDIT_PROFILE]: (state) => {
    return state
      .set('editProfile', true)
  },
  [CANCEL_EDIT_PROFILE]: (state) => {
    return state
      .set('editProfile', false)
  },
  [ENABLE_PROFILE]: (state) => {
    return state
      .set('enableProfile', true)
  },
  [CANCEL_ENABLE_PROFILE]: (state) => {
    return state
      .set('enableProfile', false)
  },
  [SHOW_DISABLE_MODAL]: (state) => {
    return state
      .set('disableStaffMemberModal', true)
  },
  [HIDE_DISABLE_MODAL]: (state) => {
    return state
      .set('disableStaffMemberModal', false)
  },
  [SHOW_EDIT_AVATAR_MODAL]: (state) => {
    return state
      .set('editAvatarModal', true)
  },
  [HIDE_EDIT_AVATAR_MODAL]: (state) => {
    return state
      .set('editAvatarModal', false)
  }
}, initialState);

export default profileReducer;
