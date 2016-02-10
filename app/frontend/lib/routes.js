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
            return "venues/" + venueId + "/rotas/" + utils.formatDateForApi(date) + "/rota_shifts"
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
    },
    updateRotaStatus: {
        getPath: function(options){
            var {rotaId, status} = options;
            return "rotas/" + rotaId + "/mark_" + status;

        },
        method: "POST"
    },
    publishRotas: {
        getPath: function(options){
            var { venueId, startDate, endDate } = options;
            return "rotas/publish?venue_id=" + venueId +
                "&start_date=" + utils.formatDateForApi(startDate) +
                "&end_date=" + utils.formatDateForApi(startDate)
        },
        method: "POST"
    }
}

window.debug = window.debug || {};
window.debug.apiRoutes = apiRoutes;

export {apiRoutes}
export const API_ROOT = "/api/v1/"