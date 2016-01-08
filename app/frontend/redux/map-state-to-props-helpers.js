import _ from 'underscore'

export function extendStaffTypeInformation(staff, staffTypes){
    return _(staff).mapValues(function(staff){
        staff = _.clone(staff);
        staff.readable_staff_type = staffTypes[staff.staff_type].title;
        staff.staff_type_object = staffTypes[staff.staff_type];
        return staff;
    });
}