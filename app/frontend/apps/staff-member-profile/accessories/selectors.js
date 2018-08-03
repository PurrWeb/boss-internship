import { createSelector } from 'reselect';

const accessoriesPermissionsSelector = state =>
  state.getIn(['profile', 'permissionsData', 'accessoriesTab', 'accessory_requests']);
export const canCreateAccessoryRequest = state =>
  state.getIn(['profile', 'permissionsData', 'accessoriesTab', 'canCreateAccessoryRequest']);

export const getAccessoryRequestPermission = createSelector(
  accessoriesPermissionsSelector,
  accessoryRequestsPermissions => accessoryRequestId => {
    return accessoryRequestsPermissions.get(accessoryRequestId.toString());
  },
);
