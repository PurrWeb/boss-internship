import _ from "underscore"

function parseDate(dateString){
    var [year, month, day] = dateString.split("-").map(parseFloat);
    return new Date(year, month - 1, day, 12, 0);
}

export function processRotaObject(rota){
    var newRota = {...rota};

    var date = rota.date;
    newRota.date = parseDate(date);

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
        start_date: parseDate(holiday.start_date),
        end_date: parseDate(holiday.end_date)
    })
}