import oFetch from "o-fetch"

export default function({
    venuesById,
    rotasById,
    shift
}){
    var rota = shift.rota.get(rotasById);
    return rota.venue.get(venuesById);
}