import _ from "underscore"
import {
    selectIsUpdatingStaffMemberStatus,
    selectIsUpdatingStaffMemberPin,
    selectEnterManagerModeIsInProgress
} from "./api-requests"

export function selectStaffMembers(state){
    return _.mapObject(state.staffMembers, function(staffMember){
        staffMember = {...staffMember}

        var staffTypeObject = staffMember.staff_type.get(state.staffTypes);
        staffMember.staffType = staffTypeObject;

        staffMember.isManager = staffTypeObject.name === "Manager";
        staffMember.isSupervisor = staffTypeObject.name === "Bar Supervisor";
        staffMember.isGeneralManager = staffTypeObject.name === "GM";

        staffMember.updateStatusInProgress = selectIsUpdatingStaffMemberStatus(state, {
            staffMemberServerId: staffMember.serverId
        });
        staffMember.updatePinInProgress = selectIsUpdatingStaffMemberPin(state, {
            staffMemberServerId: staffMember.serverId
        });
        staffMember.enterManagerModeInProgress = selectEnterManagerModeIsInProgress(state, {
            staffMemberServerId: staffMember.serverId
        });

        return staffMember
    })
}

export function selectStaffMemberHolidays(state, staffId){
    return _(state.holidays).filter(function(holiday){
        return holiday.staff_member.clientId == staffId
    })
}

export function selectStaffMemberUnpaidHolidays(state, staffId){
    return _.filter(selectStaffMemberHolidays(state, staffId), {
        holiday_type: "unpaid_holiday"
    })
}

export function selectStaffMemberPaidHolidays(state, staffId){
    return _.filter(selectStaffMemberHolidays(state, staffId), {
        holiday_type: "paid_holiday"
    })
}

export function selectStaffMemberIsOnHolidayOnDate(state, staffId, date){
    var staffMemberHolidays = selectStaffMemberHolidays(state, staffId);
    var isOnHoliday = false;
    staffMemberHolidays.forEach(function(holiday){
        if (holiday.start_date <= date && holiday.end_date >= date){
            isOnHoliday = true;
        }
    });

    return isOnHoliday;
}
