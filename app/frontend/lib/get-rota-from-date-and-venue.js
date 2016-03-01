import _ from "underscore"
import moment from "moment"

function datesAreEqual(date1, date2){
    return moment(date1).format("DD-MM-YYYY") === moment(date2).format("DD-MM-YYYY");
}

function generateDefaultRota({dateOfRota, venueId}){
    return {
        date: new Date(dateOfRota),
        venue: {id: venueId},
        status: "in_progress"
    }
}

export default function getRotaFromDateAndVenue(rotasAsArray, dateOfRota, venueId){
    var rota = _.find(rotasAsArray, function(rota){
        return rota.venue.id === venueId && datesAreEqual(rota.date, dateOfRota)
    });
    if (rota === undefined){
        return generateDefaultRota({dateOfRota, venueId});
    }
    return rota;
}