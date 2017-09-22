import { fromJS, Map, List } from 'immutable';
import { handleActions } from 'redux-actions';

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
      accessibleVenues,
      accessiblePayrates,
    } = action.payload;

    const pageVenuesIds = [...new Set([...accessibleVenues, staffMember.master_venue, ...staffMember.other_venues])];
    const pagePayRatesIds = [...new Set([...accessiblePayrates, staffMember.pay_rate])];

    const pageVenues = pageVenuesIds.reduce((prev, id) => {
      if (id) {
        const venue = venues.find(venue => venue.id === id);
        return [...prev, {id: venue.id, name: venue.name}];      
      }
      return prev;
    }, []);

    const pagePayRates = pagePayRatesIds.reduce((prev, id) => {
      if (id) {
        const payRate = payRates.find(payRate => payRate.id === id);
        return [...prev, {id: payRate.id, name: payRate.name}];      
      }
      return prev;
    }, []);

    return state
      .set('staffMember', fromJS(staffMember))
      .set('accessToken', fromJS(accessToken))
      .set('staffTypes', fromJS(staffTypes))
      .set('venues', fromJS(pageVenues))
      .set('payRates', fromJS(pagePayRates))
      .set('genderValues', fromJS(genderValues))
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
