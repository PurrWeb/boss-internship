import _ from "underscore"
import utils from "~lib/utils"




//////////////////

function getClientId(serverId, objectTypeName) {
    return generateClientId(serverId, objectTypeName).id;
}   

function generateClientId(serverId, objectTypeName){
    if (serverId === null) {
        return {
            id: objectTypeName + "_UNPERSISTED_ON_LOAD_" + _.uniqueId(),
            unpersisted: true
        }
    } else {
        return {
            id: objectTypeName + "_" + serverId,
            unpersisted: false
        }
    }
}

function setObjectIds(obj){
    obj.serverId = obj.id;
    delete obj.id;
    var clientId = getClientId(serverId, objectTypeName);
    obj.clientId = clientId.id;

    return obj;
}

function valueIsLink(value){
    return value.id !== undefined && value.url !== undefined
}

function makeLinkResolverFunction(link, key, objectTypeName){
    return function(linkObjectsArray){
        if (!_.isArray(linkObjectsArray)){
            throw new Error("linkResolver was passed something other than an array");
        }
        var clientId = generateClientId(link.id, objectTypeName);
        if (clientId.unpersisted) {
            throw new Error("Can't resolve a link to an unpersisted object");
        }
        var resolvedLink = _.find(linkObjectsArray, {clientId: clinetId.id});
        if (resolvedLink === undefined) {
            throw new Error("Couldn't resolve " + key + " with clientId " + clientId.id);
        }
        return resolvedLink;
    }
}

function processObjectLinks(obj){
    for (var key in obj){
        var value = obj[key];
        if (valueIsLink(value)) {
            value.get = makeLinkResolverFunction(value, key, objectTypeName);
        }
    }
}

function processBackendObject(backendObj, objectTypeName){
    var obj = {...backendObj};

    setObjectIds();
    processObjectLinks();
    
    return obj;
}

////////////////////////

export function processRotaObject(rota){
    var newRota = {...rota};

    var date = rota.date;
    newRota.date = new Date(date);

    newRota.clientId = getClientId(rota.id, "ROTA");

    return newRota
}

export function processShiftObject(shift){
    return Object.assign({}, shift, {
        starts_at: new Date(shift.starts_at),
        ends_at: new Date(shift.ends_at),
        rota: Object.assign({}, shift.rota, {clientId: getClientId(shift.rota.id, "ROTA")})
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