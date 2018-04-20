import oFetch from 'o-fetch';

export const staffMemberProfileHolidaysPermissions = {
  canEditHoliday: function(params){
    const jsPermissionsData = oFetch(params, 'permissionsData').toJS();
    const allHolidayPermissions = oFetch(jsPermissionsData, 'holidays')
    const holidayId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayPermissions, holidayId)
    return oFetch(specificPermissionsData, 'isEditable');
  },
  canDestroyHoliday: function(params){
    const jsPermissionsData = oFetch(params, 'permissionsData').toJS();
    const allHolidayPermissions = oFetch(jsPermissionsData, 'holidays')
    const holidayId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayPermissions, holidayId)
    return oFetch(specificPermissionsData, 'isDeletable');
  },
  canEditHolidayRequest: function(params){
    const jsPermissionsData = oFetch(params, 'permissionsData').toJS();
    const allHolidayRequestPermissions = oFetch(jsPermissionsData, 'holidayRequests');
    const holidayRequestId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayRequestPermissions, holidayRequestId)
    return oFetch(specificPermissionsData, 'isEditable');
  },
  canDestroyHolidayRequest: function(params){
    const jsPermissionsData = oFetch(params, 'permissionsData').toJS();
    const allHolidayRequestPermissions = oFetch(jsPermissionsData, 'holidayRequests');
    const holidayRequestId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayRequestPermissions, holidayRequestId)
    return oFetch(specificPermissionsData, 'isDeletable');
  }
}
