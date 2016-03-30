import utils from "~lib/utils"
import moment from "moment"
import oFetch from "o-fetch"

export const appRoutes = {
    rota: function (options){
        var [venueId, date] = oFetch(options, "venueId", "date");
        return "/venues/" + venueId + "/rotas/" + utils.formatRotaUrlDate(date);
    },
    rotaPdfDownload: function(options){
        var [venueId, startDate, endDate] = oFetch(options, "venueId", "startDate", "endDate");
        return [
            '/rotas.pdf?',
            'start_date=' + utils.formatRotaUrlDate(startDate),
            '&end_date=' + utils.formatRotaUrlDate(endDate),
            '&venue_id=' + venueId
        ].join("")
    },
    securityRotaPdfDownload: function(options){
        var date = oFetch(options, "date");
        return [
            '/security_rotas.pdf?',
            'date=' + utils.formatRotaUrlDate(date)
        ].join("");
    },
    rotaOverview: function(options){
        var [venueId, startDate, endDate] = oFetch(options, "venueId", "startDate", "endDate");
        return [
            "/rotas/?venue_id=" + venueId,
            "&start_date=" + utils.formatRotaUrlDate(startDate),
            "&end_date=" + utils.formatRotaUrlDate(endDate)
        ].join("");
    },
    changeOrdersIndex: function(options){
      let date = oFetch(options, "date");
      let venueId = oFetch(options, "venueId");

      return [
        'change_orders?',
        'date=' + utils.formatRotaUrlDate(date),
        '&venue_id=' + venueId
      ].join('');
    },
    changeOrderReportsIndex: function(options){
      let date = oFetch(options, "date");
      return 'change_order_reports?date=' + utils.formatRotaUrlDate(date);
    },
    holidayReportsIndex: function(options) {
        var date = oFetch(options, "date");
        var venueId = options.venueId; // venueId is optional

        var parts = [
            "holiday_reports?",
            "date=" + utils.formatRotaUrlDate(date)
        ];
        if (venueId !== undefined && venueId !== null) {
            parts.push("&venue=" + venueId);
        }
        return parts.join("");
    },
    staffMemberHolidays: function(staffMemberId){
        if (staffMemberId === undefined) {
            throw new Error("No staff member id supplied to appRoutes.staffMemberHolidays")
        }
        return "/staff_members/" + staffMemberId + "?tab=holidays";
    },
    holidayReportsCsv: function(options){
        var date = oFetch(options, "date");
        var venueId = options.venueId; //optional
        var parts = [
          "/holiday_reports.csv?" +
          'date=' + utils.formatRotaUrlDate(date)
        ];
        if (venueId !== null && venueId !== undefined){
            parts.push('&venue=' + venueId);
        }
        return parts.join("")
    },
    staffTypeRota: function(options){
        var [staffTypeSlug, dateOfRota] = oFetch(options, "staffTypeSlug", "dateOfRota");
        return "/" + staffTypeSlug + "_rotas/" + utils.formatRotaUrlDate(dateOfRota);
    },
    staffTypeRotaOverview: function(options){
        var [staffTypeSlug, weekStartDate] = oFetch(options, "staffTypeSlug", "weekStartDate");
        return "/" + staffTypeSlug + "_rotas/?date=" + utils.formatRotaUrlDate(weekStartDate);
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
            var [venueServerId, date, status] = oFetch(options, "venueServerId", "date", "status");
            return "venues/" + venueServerId + "/rotas/" + utils.formatDateForApi(date) + "/mark_" + status;
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
    },
    weeklyRotaForecast: {
        getPath: function({venueId, startOfWeek}){
            return [
              "venues/" + venueId,
               "/rota_forecasts/" + utils.formatDateForApi(startOfWeek),
               '/weekly'
            ].join("");
        },
        method: "GET"
    },
    updateRotaForecast: {
        getPath: function({venueId, dateOfRota}){
            return "venues/" + venueId + "/rota_forecasts/" + utils.formatDateForApi(dateOfRota);
        },
        method: "POST"
    }
}

window.debug = window.debug || {};
window.debug.apiRoutes = apiRoutes;

export {apiRoutes}
export const API_ROOT = "/api/v1/"