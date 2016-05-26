import _ from "underscore"
import { objectHasBeenProcessed, processBackendObject, processObjectLinks, getClientId } from "./process-backend-object.js"

export function processRotaObject(rota){
    var newRota = processBackendObject(rota);

    var date = rota.date;
    newRota.date = new Date(date);

    return newRota
}

export function processVenueObject(venue){
    return processBackendObject(venue);
}

export function processStaffMemberObject(staffMember){
    staffMember = processBackendObject(staffMember);
    staffMember.isManager = function({staffTypes}){
        var staffTypeObject = staffMember.staff_type.get(staffTypes);
        return staffTypeObject.name === "Manager";
    }
    staffMember.isSupervisor = function({staffTypes}){
        var staffTypeObject = staffMember.staff_type.get(staffTypes);
        return staffTypeObject.name === "Bar Supervisor";
    }
    return staffMember;
}

export function processClockInStatusObject(clockInStatus){
    clockInStatus = {...clockInStatus};
    processObjectLinks(clockInStatus);
    return clockInStatus;
}

export function processPageOptionsObject(pageOptions){
    // page options doesn't have an id, but we want to resolve IDs
    // in any links it contains
    pageOptions = {...pageOptions};
    processObjectLinks(pageOptions);
    return pageOptions;
}

export function processStaffTypeObject(staffMember){
    return processBackendObject(staffMember);
}

export function processClockInPeriodObject(clockInPeriod){
    clockInPeriod = processBackendObject(clockInPeriod);
    clockInPeriod.starts_at = new Date(clockInPeriod.starts_at)
    // clock in periods can be incomplete
    if (clockInPeriod.ends_at !== null) {
        clockInPeriod.ends_at = new Date(clockInPeriod.ends_at)
    }
    return clockInPeriod;
}

export function processHoursAcceptancePeriod(processHoursAcceptancePeriod){
    processHoursAcceptancePeriod = processBackendObject(processHoursAcceptancePeriod);
    processHoursAcceptancePeriod.starts_at = new Date(processHoursAcceptancePeriod.starts_at)
    processHoursAcceptancePeriod.ends_at = new Date(processHoursAcceptancePeriod.ends_at)

    return processHoursAcceptancePeriod;
}


export function processClockInEvent(clockInEvent){
    clockInEvent = processBackendObject(clockInEvent);
    clockInEvent.time = new Date(clockInEvent.time);
    return clockInEvent
}

export function processClockInNote(clockInNote){
    return processBackendObject(clockInNote);
}

export function processClockInReason(clockInReason){
    return processBackendObject(clockInReason);
}

export function processClockInBreakObject(clockInBreak){
    clockInBreak = processBackendObject(clockInBreak);
    clockInBreak.starts_at = new Date(clockInBreak.starts_at);
    if (clockInBreak.ends_at !== null) {
        // can be null if break is still in progress
        clockInBreak.ends_at = new Date(clockInBreak.ends_at);
    }

    return clockInBreak;
}

export function processHoursAcceptanceBreakObject(hoursAcceptanceBreak){
    hoursAcceptanceBreak = processBackendObject(hoursAcceptanceBreak);
    hoursAcceptanceBreak.starts_at = new Date(hoursAcceptanceBreak.starts_at);
    hoursAcceptanceBreak.ends_at = new Date(hoursAcceptanceBreak.ends_at)

    return hoursAcceptanceBreak;
}


export function processShiftObject(shift){
    shift = processBackendObject(shift);

    return Object.assign({}, shift, {
        starts_at: new Date(shift.starts_at),
        ends_at: new Date(shift.ends_at),
        isStandby: function(){
            return this.shift_type === "standby";
        }
    });
}

export function processHolidayObject(holiday){
    holiday = processBackendObject(holiday);
    return Object.assign({}, holiday, {
        start_date: new Date(holiday.start_date),
        end_date: new Date(holiday.end_date)
    })
}

export function processRotaForecastObject(rotaForecast){
    if (rotaForecast.id === undefined){
        // This is a weekly rota that doesn't have a backend ID
        // because it's generated from the daily rotas
        rotaForecast.id = null;
    }
    var processedForecast = processBackendObject(rotaForecast);

    if (processedForecast.serverId === null) {
        processedForecast.clientId = "UNPERSISTED_FORECAST_" + _.uniqueId();
    }

    return processedForecast;
}

export function processClockInDayObject(clockInDay){
    clockInDay = processBackendObject(clockInDay)
    clockInDay.date = new Date(clockInDay.date)
    return clockInDay
}

export function processStaffTypeRotaOverviewObject(obj){
    return {
        date: new Date(obj.date),
        rota_shifts: obj.rota_shifts.map(processShiftObject),
        rotas: obj.rotas.map(processRotaObject),
        staff_members: obj.staff_members.map(processStaffMemberObject),
        staff_types: obj.staff_types.map(processStaffTypeObject),
        venues: obj.venues.map(processVenueObject)
    }
}

export function processVenueRotaOverviewObject(obj){
    return {
        rota: processRotaObject(obj.rota),
        rota_shifts: obj.rota_shifts.map(processShiftObject),
        staff_members: obj.staff_members.map(processStaffMemberObject),
        staff_types: obj.staff_types.map(processStaffTypeObject)
    }
}

export function processHolidayAppViewData(viewData){
    var pageData = {...viewData.pageData};
    var venueServerId = pageData.venueId;
    delete pageData.venueId;
    pageData.venueServerId = venueServerId;
    if (venueServerId === null){
        // no venue filter
        pageData.venueClientId = null;
    } else {
        pageData.venueClientId = getClientId(pageData.venueServerId);
    }

    return {
        staffTypes: viewData.staffTypes.map(processStaffTypeObject),
        staffMembers: viewData.staffMembers.map(processStaffMemberObject),
        holidays: viewData.holidays.map(processHolidayObject),
        venues: viewData.venues.map(processVenueObject),
        pageData
    }
}

export {objectHasBeenProcessed}
