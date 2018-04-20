import oFetch from 'o-fetch';

export const staffMemberProfileHolidaysPermissions = {
  canEditHoliday: function(params){
    const permissionsData = oFetch(params, 'permissionsData');
    const allHolidayPermissions = oFetch(permissionsData, 'holidays')
    const holidayId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayPermissions, holidayId)
    return oFetch(specificPermissionsData, 'isEditable');
  },
  canDestroyHoliday: function(params){
    const permissionsData = oFetch(params, 'permissionsData');
    const allHolidayPermissions = oFetch(permissionsData, 'holidays')
    const holidayId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayPermissions, holidayId)
    return oFetch(specificPermissionsData, 'isDeletable');
  },
  canEditHolidayRequest: function(params){
    const permissionsData = oFetch(params, 'permissionsData');
    const allHolidayRequestPermissions = oFetch(permissionsData, 'holidayRequests');
    const holidayRequestId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayRequestPermissions, holidayRequestId)
    return oFetch(specificPermissionsData, 'isEditable');
  },
  canDestroyHolidayRequest: function(params){
    const permissionsData = oFetch(params, 'permissionsData');
    const allHolidayRequestPermissions = oFetch(permissionsData, 'holidayRequests');
    const holidayRequestId = oFetch(params, 'id');
    const specificPermissionsData = oFetch(allHolidayRequestPermissions, holidayRequestId)
    return oFetch(specificPermissionsData, 'isDeletable');
  }
}
