import _ from "underscore"
import moment from "moment"

function datesAreEqual(date1, date2){
    return moment(date1).format("DD-MM-YYYY") === moment(date2).format("DD-MM-YYYY");
}

export default function getRotaFromDateAndVenue(rotas, dateOfRota, venueId){
    var rota = _.find(rotas, function(rota){
        return rota.venue.id === venueId && datesAreEqual(rota.date, dateOfRota)
    });
    if (!rota){
        throw "Rota not found";
    }
    return rota;
}