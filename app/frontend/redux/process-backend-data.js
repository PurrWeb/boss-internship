import _ from "underscore"
import utils from "~lib/utils"

export function processRotaObject(rota){
    var newRota = {...rota};

    var date = rota.date;
    newRota.date = utils.parseBackendDateNotTime(date);

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
        start_date: utils.parseBackendDateNotTime(holiday.start_date),
        end_date: utils.parseBackendDateNotTime(holiday.end_date)
    })
}