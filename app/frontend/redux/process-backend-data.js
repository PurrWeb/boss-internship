import _ from "underscore"
import utils from "~lib/utils"




//////////////////

function getClientId(serverId){
    return "CLIENT_ID_" + serverId;
}

function setObjectIds(obj, objectTypeName){
    obj.serverId = obj.id;
    delete obj.id;
    obj.clientId = getClientId(obj.serverId);

    return obj;
}

function valueIsLink(value){
    return value.id !== undefined && value.url !== undefined
}

function makeLinkResolverFunction(link, key, objectTypeName){
    return function(linkObjectsByClientId){
        var resolvedLink = linkObjectsByClientId[link.clientId];
        if (resolvedLink === undefined) {
            throw new Error("Couldn't resolve " + key + " with clientId " + link.clientId);
        }
        return resolvedLink;
    }
}

function processObjectLinks(obj, objectTypeName){
    for (var key in obj){
        var value = obj[key];
        if (valueIsLink(value)) {
            value.clientId = getClientId(value.id);
            delete value.id;
            value.get = makeLinkResolverFunction(value, key, objectTypeName);
            value.getParentForDebugging = () => obj;
        }
    }
}

function processBackendObject(backendObj, objectTypeName){
    var obj = {...backendObj};

    setObjectIds(obj, objectTypeName);
    processObjectLinks(obj, objectTypeName);
    
    return obj;
}

////////////////////////

export function processRotaObject(rota){
    var newRota = processBackendObject(rota, "ROTA");

    var date = rota.date;
    newRota.date = new Date(date);

    return newRota
}

export function processVenueObject(venue){
    return processBackendObject(venue);
}

export function processShiftObject(shift){
    return Object.assign({}, shift, {
        starts_at: new Date(shift.starts_at),
        ends_at: new Date(shift.ends_at),
        rota: Object.assign(
            {},
            shift.rota,
            {clientId: getClientId(shift.rota.id)}
        )
    });
}

export function processHolidayObject(holiday){
    return Object.assign({}, holiday, {
        start_date: new Date(holiday.start_date),
        end_date: new Date(holiday.end_date)
    })
}

export function processRotaForecastObject(rotaForecast){
    var processedForecast = {...rotaForecast};

    processedForecast.date = new Date(processedForecast.date)

    if (processedForecast.id === null) {
        processedForecast.id = "UNPERSISTED_FORECAST_" + _.uniqueId();
    }

    return processedForecast;
}

export { getClientId }