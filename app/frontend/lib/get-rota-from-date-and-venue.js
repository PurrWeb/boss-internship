import _ from "underscore"
import moment from "moment"
import utils from "./utils"
import { processRotaObject } from "~redux/process-backend-data"

function generateDefaultRota({dateOfRota, venueId}){
    var backendData = {
        date: new Date(dateOfRota),
        venue: {id: venueId},
        status: "in_progress",
        id: null
    }
    return backendData;
}

export default function getRotaFromDateAndVenue({rotas, dateOfRota, venueId, generateIfNotFound}){
    var rota = _.find(rotas, function(rota){
        return rota.venue.clientId === venueId && utils.datesAreEqual(rota.date, dateOfRota)
    });
    if (rota === undefined){
        if (generateIfNotFound){
            return generateDefaultRota({dateOfRota, venueId})
        } else {
            throw new Error("Rota not found");
        }
    }
    return rota;
}