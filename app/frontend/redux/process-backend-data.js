import _ from "underscore"
import utils from "~lib/utils"

function rotaClientId(serverId){
    if (serverId === null) {
        return "ROTA_UNPERSISTED_ON_LOAD_" + _.uniqueId();
    } else {
        return "ROTA_" + serverId;
    }
}

export function processRotaObject(rota){
    var newRota = {...rota};

    var date = rota.date;
    newRota.date = new Date(date);

    newRota.clientId = rotaClientId(rota.id);

    return newRota
}

export function processShiftObject(shift){
    return Object.assign({}, shift, {
        starts_at: new Date(shift.starts_at),
        ends_at: new Date(shift.ends_at),
        rota: Object.assign({}, shift.rota, {clientId: rotaClientId(shift.rota.id)})
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