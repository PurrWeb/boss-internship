import _ from "underscore"
import utils from "~lib/utils"

export function processRotaObject(rota){
    var newRota = {...rota};

    var date = rota.date;
    newRota.date = new Date(date);

    // Before we've created the first shift for a rota the rota
    // isn't saved on the backend, so it doesn't have an ID
    if (rota.id === null) {
        newRota.id = "UNPERSISTED_ROTA_" + _.uniqueId();
    }

    return newRota
}

export function processShiftObject(shift){
    return Object.assign({}, shift, {
        starts_at: new Date(shift.starts_at),
        ends_at: new Date(shift.ends_at)
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