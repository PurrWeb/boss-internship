import _ from "underscore"
import moment from "moment"
import utils from "./utils"

function generateDefaultRota({dateOfRota, venueId}){
    return {
        date: new Date(dateOfRota),
        venue: {id: venueId},
        status: "in_progress",
        id: null
    }
}

export default function getRotaFromDateAndVenue({rotas, dateOfRota, venueId, generateIfNotFound}){
    var rota = _.find(rotas, function(rota){
        return rota.venue.id === venueId && utils.datesAreEqual(rota.date, dateOfRota)
    });
    if (rota === undefined){
        if (generateIfNotFound){
            return generateDefaultRota({dateOfRota, venueId})
        } else {
            throw "Rota not found";
        }
    }
    return rota;
}