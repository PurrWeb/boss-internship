import oFetch from "o-fetch"

export default function({
    venuesById,
    rotasById,
    shift
}){
    var rotaClientId = oFetch(shift, "rota.clientId");
    var rota = oFetch(rotasById, rotaClientId);
    return rota.venue.get(venuesById);
}