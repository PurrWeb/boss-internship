import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as accessoryTypes from '../accessories/redux/constants';

import {
  INITIAL_LOAD,
  EDIT_PROFILE,
  CANCEL_EDIT_PROFILE,
  SHOW_DISABLE_MODAL,
  HIDE_DISABLE_MODAL,
  SHOW_EDIT_AVATAR_MODAL,
  HIDE_EDIT_AVATAR_MODAL,
  UPDATE_STAFF_MEMBER,
  UPDATE_DOWNLOAD_LINK_LAST_SENT_AT,
} from './constants';

const initialState = fromJS({
  staffMember: {},
  accessToken: null,
  editProfile: false,
  staffTypes: [],
  venues: [],
  payRates: [],
  disableStaffMemberModal: false,
  editAvatarModal: false,
  permissionsData: {
    canEnable: false,
  },
});

const profileReducer = handleActions(
  {
    [INITIAL_LOAD]: (state, action) => {
      const payload = oFetch(action, 'payload');
      const staffMember = oFetch(payload, 'staffMember');
      const accessToken = oFetch(payload, 'accessToken');
      const staffTypes = oFetch(payload, 'staffTypes');
      const venues = oFetch(payload, 'venues');
      const payRates = oFetch(payload, 'payRates');
      const genderValues = oFetch(payload, 'genderValues');
      const accessibleVenueIds = oFetch(payload, 'accessibleVenueIds');
      const accessiblePayRateIds = oFetch(payload, 'accessiblePayRateIds');
      const appDownloadLinks = oFetch(payload, 'appDownloadLinks');
      const permissionsData = oFetch(payload, 'permissionsData');

      return state
        .set('staffMember', fromJS(staffMember))
        .set('accessToken', fromJS(accessToken))
        .set('staffTypes', fromJS(staffTypes))
        .set('venues', fromJS(venues))
        .set('payRates', fromJS(payRates))
        .set('genderValues', fromJS(genderValues))
        .set(
          'accessiblePayRates',
          accessiblePayRateIds.map(id => {
            return payRates.find(payRate => {
              return oFetch(payRate, 'id') === id;
            });
          }),
        )
        .set(
          'accessibleVenues',
          accessibleVenueIds.map(id => {
            return venues.find(venue => {
              return oFetch(venue, 'id') === id;
            });
          }),
        )
        .set('appDownloadLinks', fromJS(appDownloadLinks))
        .set('permissionsData', fromJS(permissionsData));
    },
    [accessoryTypes.ADD_ACCESSORY]: (state, action) => {
      const permissions = oFetch(action.payload, 'permissions');
      return Object.keys(permissions).reduce((acc, accessoryId) => {
        return acc.setIn(
          ['permissionsData', 'accessoriesTab', 'accessory_requests', accessoryId],
          fromJS(permissions[accessoryId]),
        );
      }, state);
    },
    [UPDATE_STAFF_MEMBER]: (state, action) => {
      const staffMember = action.payload;
      return state.set('staffMember', fromJS(staffMember));
    },
    [UPDATE_DOWNLOAD_LINK_LAST_SENT_AT]: (state, action) => {
      const payload = oFetch(action, 'payload');
      const mobileAppId = oFetch(payload, 'mobileAppId');
      const sentAt = oFetch(payload, 'sentAt');
      const stateData = state.toJS();

      const newAppDownloadLinks = oFetch(stateData, 'appDownloadLinks').map(appDownloadLink => {
        if (oFetch(appDownloadLink, 'mobileAppId') == mobileAppId) {
          return Object.assign(appDownloadLink, { lastSentAt: sentAt });
        } else {
          return appDownloadLink;
        }
      });

      return state.set('appDownloadLinks', newAppDownloadLinks);
    },
    [EDIT_PROFILE]: state => {
      return state.set('editProfile', true);
    },
    [CANCEL_EDIT_PROFILE]: state => {
      return state.set('editProfile', false);
    },
    [SHOW_DISABLE_MODAL]: state => {
      return state.set('disableStaffMemberModal', true);
    },
    [HIDE_DISABLE_MODAL]: state => {
      return state.set('disableStaffMemberModal', false);
    },
    [SHOW_EDIT_AVATAR_MODAL]: state => {
      return state.set('editAvatarModal', true);
    },
    [HIDE_EDIT_AVATAR_MODAL]: state => {
      return state.set('editAvatarModal', false);
    },
  },
  initialState,
);

export default profileReducer;
