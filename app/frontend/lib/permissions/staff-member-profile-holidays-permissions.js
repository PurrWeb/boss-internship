import oFetch from 'o-fetch';

export const staffMemberProfileHolidaysPermissions = {
  canEditHoliday: function(params){
    const permissions = oFetch(params, 'permissions');
    const allHolidayPermissions = oFetch(permissions, 'holidays')
    const holidayId = oFetch(params, 'id');
    const specificPermissions = oFetch(allHolidayPermissions, holidayId)
    return oFetch(specificPermissions, 'isEditable');
  },
  canDestroyHoliday: function(params){
    const permissions = oFetch(params, 'permissions');
    const allHolidayPermissions = oFetch(permissions, 'holidays')
    const holidayId = oFetch(params, 'id');
    const specificPermissions = oFetch(allHolidayPermissions, holidayId)
    return oFetch(specificPermissions, 'isDeletable');
  },
  canEditHolidayRequest: function(params){
    const permissions = oFetch(params, 'permissions');
    const allHolidayRequestPermissions = oFetch(permissions, 'holidayRequests');
    const holidayRequestId = oFetch(params, 'id');
    const specificPermissions = oFetch(allHolidayRequestPermissions, holidayRequestId)
    return oFetch(specificPermissions, 'isEditable');
  },
  canDestroyHolidayRequest: function(params){
    const permissions = oFetch(params, 'permissions');
    const allHolidayRequestPermissions = oFetch(permissions, 'holidayRequests');
    const holidayRequestId = oFetch(params, 'id');
    const specificPermissions = oFetch(allHolidayRequestPermissions, holidayRequestId)
    return oFetch(specificPermissions, 'isDeletable');
  }
}
