import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { MANAGER_ROLE, ANY } from './constants';

export const statusFilterSelector = state => state.getIn(['filters', 'status']);
export const roleFilterSelector = state => state.getIn(['filters', 'role']);
export const invitesSelector = state => state.get('invites');
export const venuesSelector = state => state.get('venues');

export const inviteIdsFilteredByRole = createSelector(roleFilterSelector, invitesSelector, (role, invites) => {
  let filteredInvites;
  if (role && role !== ANY) {
    filteredInvites = invites.filter(invite => invite.get('role').toLowerCase() === role.toLowerCase());
  } else {
    filteredInvites = invites;
  }
  return Immutable.Set(filteredInvites.map(invite => invite.get('id')));
});

export const inviteIdsFilteredByStatus = createSelector(statusFilterSelector, invitesSelector, (status, invites) => {
  let filteredInvites;
  if (status && status !== ANY) {
    filteredInvites = invites.filter(invite => invite.get('currentState').toLowerCase() === status.toLowerCase());
  } else {
    filteredInvites = invites;
  }
  return Immutable.Set(filteredInvites.map(invite => invite.get('id')));
});

export const invitesFilteredByAllFilters = createSelector(
  inviteIdsFilteredByRole,
  inviteIdsFilteredByStatus,
  invitesSelector,
  venuesSelector,
  (invitesFilteredByRole, invitesFilteredByStatus, invites, venues) => {
    const filteredinviteIds = invitesFilteredByRole.intersect(invitesFilteredByStatus);
    return invites.filter(invite => filteredinviteIds.has(invite.get('id'))).map(invite =>
      invite.set(
        'venueNames',
        invite.get('role') === MANAGER_ROLE
          ? venues
              .filter(v => invite.get('venueIds').includes(v.get('id')))
              .map(venue => venue.get('name'))
              .join(', ')
          : 'All',
      ),
    );
  },
);
