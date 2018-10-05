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

export function processReadonlyVenueObject(venue){
    return processBackendObject(venue);
}

export function processStaffMemberObject(staffMember){
    staffMember = processBackendObject(staffMember);
    return staffMember;
}

export function processPageOptionsObject(pageOptions){
    // page options doesn't have an id, but we want to resolve IDs
    // in any links it contains
    pageOptions = {...pageOptions};
    processObjectLinks(pageOptions);

    if (pageOptions.date){
        pageOptions.date = new Date(pageOptions.date)
    }
    if (pageOptions.dateOfRota){
        pageOptions.dateOfRota =  new Date(pageOptions.dateOfRota)
    }

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

export function processHoursAcceptancePeriodObject(processHoursAcceptancePeriod){
    processHoursAcceptancePeriod = processBackendObject(processHoursAcceptancePeriod);
    processHoursAcceptancePeriod.starts_at = new Date(processHoursAcceptancePeriod.starts_at)
    processHoursAcceptancePeriod.ends_at = new Date(processHoursAcceptancePeriod.ends_at)

    return processHoursAcceptancePeriod;
}


export function processClockInEventObject(clockInEvent){
    clockInEvent = processBackendObject(clockInEvent);
    clockInEvent.at = new Date(clockInEvent.at);
    return clockInEvent
}

export function processClockInNoteObject(clockInNote){
    return processBackendObject(clockInNote);
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


export function processRotaShiftObject(shift){
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
    return processBackendObject(holiday);
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
    clockInDay.readonly = false;
    return clockInDay
}

export function processReadonlyClockInDayObject(clockInDay){
    clockInDay = processBackendObject(clockInDay);
    clockInDay.date = new Date(clockInDay.date);
    clockInDay.readonly = true;
    return clockInDay
}

export function processStaffTypeRotaOverviewObject(obj){
    return {
        date: new Date(obj.date),
        rota_shifts: obj.rota_shifts.map(processRotaShiftObject),
        rotas: obj.rotas.map(processRotaObject),
        staff_members: obj.staff_members.map(processStaffMemberObject),
        staff_types: obj.staff_types.map(processStaffTypeObject),
        venues: obj.venues.map(processVenueObject)
    }
}

export function processVenueRotaOverviewObject(obj){
    return {
        rota: processRotaObject(obj.rota),
        rota_shifts: obj.rota_shifts.map(processRotaShiftObject),
        staff_members: obj.staff_members.map(processStaffMemberObject),
        staff_types: obj.staff_types.map(processStaffTypeObject),
        rota_forecast: processRotaForecastObject(obj.rota_forecast)
    }
}

export function processHolidayAppViewData(viewData){
    var pageData = {...viewData.pageData};

    return {
        staffTypes: viewData.staffTypes.map(processStaffTypeObject),
        staffMembers: viewData.staffMembers.map(processStaffMemberObject),
        holidays: viewData.holidays.map(processHolidayObject),
        venues: viewData.venues.map(processVenueObject),
        holidaysCount: viewData.holidaysCount,
        staffMembersCount: viewData.staffMembersCount,
        pageData
    }
}

export {objectHasBeenProcessed}
