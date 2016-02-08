import utils from "~lib/utils"
import moment from "moment"

export const appRoutes = {
    rota: function (options){
        var {venueId, date} = options;
        return "/venues/" + venueId + "/rotas/" + utils.formatRotaUrlDate(date);
    },
    rotaOverview: function(options){
        var {venueId, startDate, endDate} = options;
        return [
            "/rotas/?venue_id=" + venueId,
            "&start_date=" + utils.formatRotaUrlDate(startDate),
            "&end_date=" + utils.formatRotaUrlDate(endDate)
        ].join("");
    }
}

const apiRoutes = {
    addShift: {
        getPath: function(venueId, date){
            return "venues/" + venueId + "/rotas/" + moment(date).format("DD-MM-YYYY") + "/rota_shifts"
        },
        method: "POST"
    },
    updateShift: {
        getPath: function(options){
            return "rota_shifts/" + options.shiftId;
        },
        method: "PATCH"
    },
    deleteShift: {
        getPath: function(options){
            return "rota_shifts/" + options.shiftId;
        },
        method: "DELETE"
    }
}


export {apiRoutes}
export const API_ROOT = "/api/v1/"