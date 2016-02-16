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
    },
    holidayReportsIndex: function(options) {
      var { date, venueId } = options;
      return [
        'holiday_reports?',
        'date=' + utils.formatRotaUrlDate(date),
        '&venue=' + venueId
      ].join('');
    },
    staffMemberHolidays: function(staffMemberId){
      return "/staff_members/" + staffMemberId + "?tab=holidays";
    },
    holidayReportsCsv: function({date, venueId}){
        return [
          "/holiday_reports.csv?" +
          'date=' + utils.formatRotaUrlDate(date),
          '&venue=' + venueId
        ].join("")
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
            var {venueId, date, status} = options;
            return "venues/" + venueId + "/rotas/" + utils.formatDateForApi(date) + "/mark_" + status;
        },
        method: "POST"
    },
    publishRotas: {
        getPath: function(options){
            var { venueId, date } = options;
            return [
                "/venues/" + venueId,
                "/rotas/publish/?",
                "date=" + utils.formatDateForApi(date)
            ].join("")
        },
        method: "POST"
    }
}

window.debug = window.debug || {};
window.debug.apiRoutes = apiRoutes;

export {apiRoutes}
export const API_ROOT = "/api/v1/"