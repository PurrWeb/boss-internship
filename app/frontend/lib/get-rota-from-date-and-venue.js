import _ from "underscore"
import moment from "moment"

function datesAreEqual(date1, date2){
    return moment(date1).format("DD-MM-YYYY") === moment(date2).format("DD-MM-YYYY");
}

function generateDefaultRota({dateOfRota, venueId}){
    return {
        date: new Date(dateOfRota),
        venue: {id: venueId},
        status: "in_progress",
        id: null
    }
}

export default function getRotaFromDateAndVenue(rotas, dateOfRota, venueId, generateIfNotFound){
    var rota = _.find(rotas, function(rota){
        return rota.venue.id === venueId && datesAreEqual(rota.date, dateOfRota)
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