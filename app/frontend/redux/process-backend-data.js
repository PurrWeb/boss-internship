export function processRotaObject(rota){
    var newRota = {...rota};

    var date = rota.date;
    var [year, month, day] = date.split("-").map(parseFloat);
    newRota.date = new Date(year, month - 1, day, 12, 0);

    // Before we've created the first shift for a rota the rota
    // isn't saved on the backend, so it doesn't have an ID
    if (rota.id === null) {
        newRota.id = "UNPERSISTED_ROTA";
    }

    return newRota
}

export function processShiftObject(shift){
    return Object.assign({}, shift, {
        starts_at: new Date(shift.starts_at),
        ends_at: new Date(shift.ends_at)
    });
}