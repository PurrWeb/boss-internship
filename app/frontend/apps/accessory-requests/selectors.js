import { createSelector } from 'reselect';

const accessoryRequestsPermissionsSelector = state =>
  state.getIn(['accessoryRequestsPage', 'permissionsData', 'accessoryRequests']);
const accessoryRefundRequestsPermissionsSelector = state =>
  state.getIn(['accessoryRequestsPage', 'permissionsData', 'accessoryRefundRequests']);

export const getAccessoryRequestPermission = createSelector(
  accessoryRequestsPermissionsSelector,
  accessoryRequestsPermissions => accessoryRequestId => {
    return accessoryRequestsPermissions.get(accessoryRequestId.toString());
  },
);

export const getAccessoryRefundRequestPermission = createSelector(
  accessoryRefundRequestsPermissionsSelector,
  accessoryRefundRequestsPermissions => accessoryRefundRequestId => {
    return accessoryRefundRequestsPermissions.get(accessoryRefundRequestId.toString());
  },
);
