import _ from "underscore"
import utils from "~lib/utils"




//////////////////

function getClientId(serverId){
    if (serverId === undefined){
        throw new Error("Server ID cannot be undefined");
    }
    return "CLIENT_ID_" + serverId;
}

function setObjectIds(obj){
    obj.serverId = obj.id;
    delete obj.id;
    obj.clientId = getClientId(obj.serverId);

    return obj;
}

function valueIsLink(value){
    if (value === null){
        return false;
    }
    return value.id !== undefined;
}

function makeLinkResolverFunction(link, key){
    return function(linkObjectsByClientId){
        var resolvedLink = linkObjectsByClientId[link.clientId];
        if (resolvedLink === undefined) {
            throw new Error("Couldn't resolve " + key + " with clientId " + link.clientId);
        }
        return resolvedLink;
    }
}

function processLinkObject({link, parent, key}){
    link.clientId = getClientId(link.id);
    link.serverId = link.id;
    delete link.id;
    link.get = makeLinkResolverFunction(link, key);
    link.getParentForDebugging = () => obj;
}

function processObjectLinks(obj){
    for (var key in obj){
        var value = obj[key];
        if (_.isArray(value)) {
            // if the array items are links process them
            if (value.length > 0) {
                if (valueIsLink(value[0])) {
                    value.forEach((link,i) => {
                        processLinkObject({
                            link,
                            parent: obj,
                            key: key + "." + i
                        })
                    });
                }
            }
        }
        if (valueIsLink(value)) {
            processLinkObject({
                link: value,
                parent: obj,
                key
            });
        }
    }
}

function processBackendObject(backendObj){
    if (backendObj.clientId !== undefined){
        throw "Backend object has already been processed.";
    }
    var obj = {...backendObj};

    setObjectIds(obj);
    processObjectLinks(obj);
    
    return obj;
}

////////////////////////

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
    return processBackendObject(staffMember);
}

export function processStaffTypeObject(staffMember){
    return processBackendObject(staffMember);
}

export function processShiftObject(shift){
    shift = processBackendObject(shift);

    return Object.assign({}, shift, {
        starts_at: new Date(shift.starts_at),
        ends_at: new Date(shift.ends_at)
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

export function processHolidayAppViewState(viewState){
    var pageData = {...viewState.pageData};
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
        staffTypes: viewState.staffTypes.map(processStaffTypeObject),
        staffMembers: viewState.staffMembers.map(processStaffMemberObject),
        holidays: viewState.holidays.map(processHolidayObject),
        venues: viewState.venues.map(processVenueObject),
        pageData
    }
}

export { getClientId }




