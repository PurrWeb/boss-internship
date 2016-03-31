import _ from "underscore"
import { processBackendObject, processObjectLinks } from "./process-backend-object.js"

export function processRotaObject(rota){
    if (rota.id === null){
        rota = {...rota};
        rota.id = "UNPERSISTED_ROTA_" + _.uniqueId();
    }
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
    return staffMember;
}

export function processStaffStatusObject(staffStatus){
    var staffStatus = {...staffStatus};
    processObjectLinks(staffStatus);
    return staffStatus;
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

export function processShiftObject(shift){
    shift = processBackendObject(shift);

    return Object.assign({}, shift, {
        starts_at: new Date(shift.starts_at),
        ends_at: new Date(shift.ends_at),
        isStandby: function(){
            return shift.shift_type === "standby";
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
