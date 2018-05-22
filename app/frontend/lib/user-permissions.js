import oFetch from 'o-fetch';
import _ from 'lodash';

export const DEV_ROLE = 'dev';
export const ADMIN_ROLE = 'admin';
export const AREA_MANAGER_ROLE = 'area_manager';
export const MANAGER_ROLE = 'manager';;
export const MARKETING_ROLE = 'marketing';
export const MAINTENANCE_ROLE = 'maintenance_staff';
export const OPS_MANAGER_ROLE = 'ops_manager';
export const SECURITY_MANAGER_ROLE = 'security_manager';
export const PAYROLL_MANAGER = 'payroll_manager';
export const FOOD_OPS_MANAGER = 'food_ops_manager';

export const DEV_ACCESS_LEVEL = 'dev';
export const ADMIN_ACCESS_LEVEL = 'admin';
export const AREA_MANAGER_ACCESS_LEVEL = 'area_manager';
export const OPS_MANAGER_ACCESS_LEVEL = 'ops_manager';
export const MANAGER_ACCESS_LEVEL = 'manager';
export const RESTRICTED_ACCESS_LEVEL = 'restricted';

let LEVEL_DATA = {};
LEVEL_DATA[DEV_ACCESS_LEVEL] = 5;
LEVEL_DATA[ADMIN_ACCESS_LEVEL] = 4;
LEVEL_DATA[AREA_MANAGER_ACCESS_LEVEL] = 3;
LEVEL_DATA[OPS_MANAGER_ACCESS_LEVEL] = 2
LEVEL_DATA[MANAGER_ACCESS_LEVEL] = 1;
LEVEL_DATA[RESTRICTED_ACCESS_LEVEL] = 0;

function isRole(params){
  const targetRole = oFetch(params, 'targetRole');
  const permissions = oFetch(params, 'permissions');

  return oFetch(permissions, 'userRole') === targetRole;
}

function hasEffectiveAccessLevel(params){
  const targetLevel = oFetch(params, 'targetLevel');
  const permissions = oFetch(params, 'permissions');
  const currentLevel = oFetch(permissions, 'accessLevel');

  return oFetch(LEVEL_DATA, `${currentLevel}`) >= oFetch(LEVEL_DATA, `${targetLevel}`)
}

function canManageVenue(params){
  const venueId = oFetch(params, 'venueId');
  const permissions = oFetch(params, 'permissions');
  const userRole = oFetch(permissions, 'userRole');
  const accessibleVenueIds = oFetch(permissions, 'accessibleVenueIds');

  return hasEffectiveAccessLevel({
      targetLevel: OPS_MANAGER_ACCESS_LEVEL,
      permissions: permissions
    }) || (
      hasEffectiveAccessLevel({
        targetLevel: MANAGER_ACCESS_LEVEL,
        permissions: permissions
      }) && _.includes(accessibleVenueIds, venueId)
    )
}

export const userPermissions = {
  holidayRequestPage: {
    canAcceptHolidayRequest: function(params) {
      const permissionsData = oFetch(params, 'permissionsData').toJS();
      const allHolidayRequestPermissions = oFetch(permissionsData, 'holidayRequests');
      const holidayRequestId = oFetch(params, 'id');
      const specificPermissions = oFetch(allHolidayRequestPermissions, holidayRequestId)
      return oFetch(specificPermissions, 'canAccept');
    },
    canRejectHolidayRequest: function(params) {
      const permissionsData = oFetch(params, 'permissionsData').toJS();
      const allHolidayRequestPermissions = oFetch(permissionsData, 'holidayRequests');
      const holidayRequestId = oFetch(params, 'id');
      const specificPermissions = oFetch(allHolidayRequestPermissions, holidayRequestId)
      return oFetch(specificPermissions, 'canReject');
    }
  },
  marketingTasks: {
    canViewPage: function(permissions) {
      return !!oFetch(permissions, 'canViewPage');
    },
    canAssignTask: function(params) {
      const permissions = oFetch(params, 'permissions');
      const marketingTask = oFetch(params, 'marketingTask');
      const taskVenue = oFetch(marketingTask, 'venue');

      return isRole({ targetRole: MARKETING_ROLE, permissions: permissions }) || (
        hasEffectiveAccessLevel({targetLevel: 'manager', permissions: permissions})
          && !(oFetch(permissions, 'userId') === (marketingTask.assignToUser || {}).id)
          && canManageVenue({venueId: oFetch(taskVenue, 'id'), permissions: permissions})
      );
    },
    canEditTask: function(params) {
      const permissions = oFetch(params, 'permissions');
      const marketingTask = oFetch(params, 'marketingTask');
      const taskVenue = oFetch(marketingTask, 'venue');

      return hasEffectiveAccessLevel({targetLevel: 'manager', permissions: permissions}) && canManageVenue({venueId: oFetch(taskVenue, 'id'), permissions: permissions})
    },
    canRestoreTask: function(params) {
      const permissions = oFetch(params, 'permissions');
      const marketingTask = oFetch(params, 'marketingTask');
      const taskVenue = oFetch(marketingTask, 'venue');

      return hasEffectiveAccessLevel({targetLevel: 'manager', permissions: permissions}) && canManageVenue({venueId: oFetch(taskVenue, 'id'), permissions: permissions})
    },
    canDestroyTask: function(params) {
      const permissions = oFetch(params, 'permissions');
      const marketingTask = oFetch(params, 'marketingTask');
      const taskVenue = oFetch(marketingTask, 'venue');

      return hasEffectiveAccessLevel({targetLevel: 'manager', permissions: permissions}) && canManageVenue({venueId: oFetch(taskVenue, 'id'), permissions: permissions})
    },
    canUpdateTaskStatus(params) {
      const permissions = oFetch(params, 'permissions');
      const marketingTask = oFetch(params, 'marketingTask');
      const taskVenue = oFetch(marketingTask, 'venue');

      return isRole({ targetRole: MARKETING_ROLE, permissions: permissions }) || (
        hasEffectiveAccessLevel({targetLevel: 'manager', permissions: permissions}) && canManageVenue({venueId: oFetch(taskVenue, 'id'), permissions: permissions})
        )
    },
    canCreateTasks: function(permissions) {
      return !!oFetch(permissions, 'canCreateTasks');
    }
  }
}
