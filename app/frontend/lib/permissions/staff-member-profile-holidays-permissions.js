import oFetch from 'o-fetch';

export const staffMemberProfileHolidaysPermissions = {
  canCreateHolidays: function(params) {
    const jsPermissionsData = oFetch(params, 'permissionsData').toJS();
    const tabPermissions = oFetch(jsPermissionsData, 'holidaysTab');
    return oFetch(tabPermissions, 'canCreateHolidays');
  },
  canEditHoliday: function(params){
    const jsPermissionsData = oFetch(params, 'permissionsData').toJS();
    const tabPermissions = oFetch(jsPermissionsData, 'holidaysTab');
    const allHolidayPermissions = oFetch(tabPermissions, 'holidays')
    const holidayId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayPermissions, holidayId)
    return oFetch(specificPermissionsData, 'isEditable');
  },
  canDestroyHoliday: function(params){
    const jsPermissionsData = oFetch(params, 'permissionsData').toJS();
    const tabPermissions = oFetch(jsPermissionsData, 'holidaysTab');
    const allHolidayPermissions = oFetch(tabPermissions, 'holidays')
    const holidayId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayPermissions, holidayId)
    return oFetch(specificPermissionsData, 'isDeletable');
  },
  canEditHolidayRequest: function(params){
    const jsPermissionsData = oFetch(params, 'permissionsData').toJS();
    const tabPermissions = oFetch(jsPermissionsData, 'holidaysTab');
    const allHolidayRequestPermissions = oFetch(tabPermissions, 'holidayRequests');
    const holidayRequestId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayRequestPermissions, holidayRequestId)
    return oFetch(specificPermissionsData, 'isEditable');
  },
  canDestroyHolidayRequest: function(params){
    const jsPermissionsData = oFetch(params, 'permissionsData').toJS();
    const tabPermissions = oFetch(jsPermissionsData, 'holidaysTab');
    const allHolidayRequestPermissions = oFetch(tabPermissions, 'holidayRequests');
    const holidayRequestId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayRequestPermissions, holidayRequestId)
    return oFetch(specificPermissionsData, 'isDeletable');
  }
}
