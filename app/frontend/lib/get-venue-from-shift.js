export default function({
    venuesById,
    rotasById,
    shift
}){
    var rota = rotasById[shift.rota.clientId];
    return venuesById[rota.venue.id];
}