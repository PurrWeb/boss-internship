import utils from "~/lib/utils"
import moment from "moment"
import oFetch from "o-fetch"
import queryString from 'query-string';

var staffMemberPaymentsAppPath = (staffMemberId, queryStringParams) => {
    if (staffMemberId === undefined) {
        throw new Error("No staff member id supplied to appRoutes.staffMember")
    }
    const baseUrl = `/staff_members/${staffMemberId}/payments`;

    if ((typeof queryStringParams === undefined) || _.isEmpty(queryStringParams)) {
        return baseUrl;
    } else {
        let queryString = '?';
        let paramIndex = 0;
        for (let key in queryStringParams) {
            queryString = `${queryString}${paramIndex > 0 ? '&' : ''}${key}=${queryStringParams[key]}`;
            paramIndex = paramIndex + 1;
        }
        return baseUrl + queryString;
    }
}

//Shared Helpers
var staffMemberProfileHolidaysTabPath = function(params){
  const staffMemberId = oFetch(params, 'staffMemberId')
  const mStartDate = params.mStartDate;
  const mEndDate = params.mEndDate;
  const mPayslipStartDate = params.mPayslipStartDate;
  const mPayslipEndDate = params.mPayslipEndDate;
  const filteringByDate = mStartDate && mEndDate;
  const filteringByPayslipDate = mPayslipStartDate && mPayslipEndDate;

  let result = "/staff_members/" + staffMemberId + "/holidays";
  if(filteringByDate || filteringByPayslipDate){
    result = result + "?"
    if(filteringByDate){
      result = result + "start_date=" + mStartDate.format(utils.apiDateFormat) + "&end_date=" + mEndDate.format(utils.apiDateFormat);
    }
    if(filteringByPayslipDate){
      if(filteringByDate){
        result = result + "&"
      }
      result = result + "payslip_start_date=" + mPayslipStartDate.format(utils.apiDateFormat) + "&payslip_end_date=" + mPayslipEndDate.format(utils.apiDateFormat);
    }
  }
  return result;
}

export const appRoutes = {
    rota: function (options){
        var [venueId, date] = oFetch(options, "venueId", "date");
        return "/rotas/" + utils.formatRotaUrlDate(date) + "&venue_id=" + venueId;
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
    rotaOverviewPdfDownload: function(options){
      let [mHighlightDate, venueId] = oFetch(options, "mHighlightDate", "venueId");
      return [
          'rotas.pdf?',
          'highlight_date=' + mHighlightDate.format(utils.apiDateFormat),
          '&venue_id=' + venueId,
      ].join("")
    },
    securityRotaPdfDownload: function(options){
        var date = oFetch(options, "date");
        return [
            '/security_rotas.pdf?',
            'date=' + date
        ].join("");
    },
    financeReportsPdfDownload: function(options){
        var date = oFetch(options, "date");
        var venueId = oFetch(options, "venueId");
        var filterType = oFetch(options, "filterType");
        return `/finance_reports/${utils.formatRotaUrlDate(date)}.pdf?venue_id=${venueId}&filter_type=${filterType}`;
    },
    financeReportsCSVExport: function(options){
      var date = oFetch(options, "date");
      var venueId = oFetch(options, "venueId");
      var filterType = oFetch(options, "filterType");
      return `/finance_reports/${utils.formatRotaUrlDate(date)}.csv?venue_id=${venueId}&filter_type=${filterType}`;
    },
    payrollReportsPdfDownload: function(options){
        var date = oFetch(options, "date");
        var venueId = oFetch(options, "venueId");
        var filterType = oFetch(options, "filterType");
        return `/payroll_reports/${utils.formatRotaUrlDate(date)}.pdf?venue_id=${venueId}&filter_type=${filterType}`;
    },
    securityRotaOverview: (options) => {
        const startDate = oFetch(options, "startDate");
        return `/security_rotas?highlight_date=${startDate}`;
    },
    securityShiftRequestReviews: (options) => {
        const startDate = oFetch(options, "startDate");
        return `/security-shift-request-reviews/${startDate}`;
    },
    securityShiftRequests: (options) => {
        const startDate = oFetch(options, "startDate");
        return `/security-shift-requests/${startDate}`;
    },
    securityRotaShiftRequests: (options) => {
      const mStartDate = oFetch(options, "mStartDate");
      return `/security_rotas/${mStartDate.format(utils.apiDateFormat)}/requests`;
    },
    securityRotaDaily: (date) => {
        return `/security_rotas/${date}`;
    },
    staffMemberProfileShifts({startDate, endDate, staffMemberId}) {
        if (!staffMemberId) {
            throw new Error(`You must apply a staffMemberId`);
        }
        if (startDate && endDate) {
            return `/staff_members/${staffMemberId}/shifts?end_date=${endDate}&start_date=${startDate}`
        }
        return `/staff_members/${staffMemberId}/shifts`
    },
    staffMemberProfileHolidays({startDate, endDate, staffMemberId}) {
        if (!staffMemberId) {
            throw new Error(`You must apply a staffMemberId`);
        }
        if (startDate && endDate) {
            return `/staff_members/${staffMemberId}/holidays?end_date=${endDate}&start_date=${startDate}`
        }
        return `/staff_members/${staffMemberId}/holidays`
    },
    rotaDaily: (date, venueId) => {
        return `/rotas/${date}${venueId ? `?venue_id=${venueId}` : ''}`;
    },
    financeReports: (options) => {
        const startDate = oFetch(options, "startDate");
        const venueId = oFetch(options, "venueId");
        return `/finance_reports/${startDate}?venue_id=${venueId}`;
    },
    payrollReports: (options) => {
        const startDate = oFetch(options, "startDate");
        const venueId = oFetch(options, "venueId");
        return `/payroll_reports/${startDate}?venue_id=${venueId}`;
    },
    rotaOverview: function(options){
        var [venueId, startDate] = oFetch(options, "venueId", "startDate");
        return [
            "/rotas?venue_id=" + venueId + "&highlight_date=" + startDate,
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
    dailyReportsPage: function(options) {
        let dateM = oFetch(options, 'dateM');
        let venueId = oFetch(options, 'venueId');

        return "daily_reports?date=" +
          utils.formatRotaUrlDate(dateM) +
          "&venue_id=" +
          venueId;
    },
    dailyReportsPDFDownload: function(options) {
        let dateM = oFetch(options, 'dateM');
        let venueId = oFetch(options, 'venueId');

        return "daily_reports.pdf?date=" +
          utils.formatRotaUrlDate(dateM) +
          "&venue_id=" +
          venueId;
    },
    holidays: function(options) {
        var startDate = oFetch(options, "startDate");
        var venueId = options.venueId; // venueId is optional

        var parts = [
            "holidays?",
            "date=" + startDate
        ];
        if (venueId !== undefined && venueId !== null) {
            parts.push("&venue=" + venueId);
        }
        return parts.join("");
    },
    staffMember: function(staffMemberId){
        if (staffMemberId === undefined) {
            throw new Error("No staff member id supplied to appRoutes.staffMember")
        }
        return "/staff_members/" + staffMemberId;
    },
    staffMemberProfileHolidaysTab: staffMemberProfileHolidaysTabPath,
    staffMemberProfileHolidaysTabFromFinanceReport: function(params) {
      const staffMemberId = oFetch(params, 'staffMemberId')
      const mPayslipStartDate = oFetch(params, 'mPayslipStartDate');
      const mPayslipEndDate = oFetch(params, 'mPayslipEndDate');

      return staffMemberProfileHolidaysTabPath({
        staffMemberId: staffMemberId,
        mPayslipStartDate: mPayslipStartDate,
        mPayslipEndDate: mPayslipEndDate
      })
    },
    staffMemberOwedHours: function(params){
      const staffMemberId = oFetch(params, 'staffMemberId')
      const mStartDate = params.mStartDate;
      const mEndDate = params.mEndDate;
      const mPayslipStartDate = params.mPayslipStartDate;
      const mPayslipEndDate = params.mPayslipEndDate;
      const filteringByDate = mStartDate && mEndDate;
      const filteringByPayslipDate = mPayslipStartDate && mPayslipEndDate;

      let result = "/staff_members/" + staffMemberId + "/owed_hours";
      if(filteringByDate || filteringByPayslipDate){
        result = result + "?"
        if(filteringByDate){
          result = result + "start_date=" + mStartDate.format(utils.apiDateFormat) + "&end_date=" + mEndDate.format(utils.apiDateFormat);
        }
        if(filteringByPayslipDate){
          if(filteringByDate){
            result = result + "&"
          }
          result = result + "payslip_start_date=" + mPayslipStartDate.format(utils.apiDateFormat) + "&payslip_end_date=" + mPayslipEndDate.format(utils.apiDateFormat);
        }
      }
      return result;
    },
    staffMemberAccessories: function(params) {
       const staffMemberId = oFetch(params, 'staffMemberId');
       const { mPayslipStartDate, mPayslipEndDate } = params;
       const filteringByPayslipDate = mPayslipStartDate && mPayslipEndDate;
       let result = `/staff_members/${staffMemberId}/accessories`;
       if (filteringByPayslipDate) {
        result = result + "?" + "payslip_start_date=" + mPayslipStartDate.format(utils.apiDateFormat) + "&payslip_end_date=" + mPayslipEndDate.format(utils.apiDateFormat);
       }
       return result;
    },
    staffMemberHoursOverview: function(staffMemberId, dDate){
        if (staffMemberId === undefined) {
            throw new Error("No staff member id supplied to appRoutes.staffMemberHoursOverview")
        }
        if (dDate === undefined) {
          throw new Error("No date supplied to appRoutes.staffMemberHoursOverview")
        }
        return "/staff_members/" + staffMemberId + "/hours_overview/" + dDate;
    },
    staffMemberPayments: staffMemberPaymentsAppPath,
    staffMemberPaymentHighlight: function(params){
      const staffMemberId = oFetch(params, 'staffMemberId');
      const mStartDate = oFetch(params, 'mStartDate');
      const mEndDate = oFetch(params, 'mEndDate');

      return staffMemberPaymentsAppPath(
        staffMemberId,
        {
          start_date: mStartDate.format(utils.apiDateFormat),
          end_date: mEndDate.format(utils.apiDateFormat)
        }
      );
    },
    holidaysCsv: function(options){
        var date = oFetch(options, "date");
        var venueId = options.venueId; //optional
        var parts = [
          "/holidays.csv?" +
          'date=' + date
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
    },
    hoursConfirmationCurrentPage: function(options){
        var venueId = oFetch(options, "venueId");
        return "/hours_confirmation/current?venue_id=" + venueId;
    },
    hoursConfirmationDayPage: function(options){
        var [date, venueId] = oFetch(options, "date", "venueId");
        return "/hours_confirmation?date=" + date.format(utils.commonDateFormat)
            + "&venue_id=" + venueId
    },
    checklistsPage: function(options){
      let venueId = oFetch(options, "venueId");
      return "/check_lists?venue_id=" + venueId;
    },
    checklistSubmissionsPage: function(options){
      let venueId = oFetch(options, "venueId");
      return "/checklist_submissions?venue_id=" + venueId;
    },
    weeklyReportsPage: function(options){
        let venueId = oFetch(options, 'venueId');
        let weekStartDateM = oFetch(options, 'weekStartDateM');
      return "/weekly_reports?venue_id=" + venueId +
        "&week_start=" + utils.formatRotaUrlDate(weekStartDateM);
    },
    wtlCardsPage: function(options = {}) {
        const { cardNumber } = options;
        return `/wtl_cards${cardNumber ? `?card_number=${cardNumber}` : ''}`;
    },
}

const apiRoutes = {
    markRepeatOffender: {
        getPath() {
            return `/api/v1/staff_vetting/mark-repeat-offender`;
        },
        method: 'POST',
    },
    addHolidayStaffMembers: {
        getPath: function({query, venueId}) {
            const urlQuery = queryString.stringify({ query, venue_id: venueId });
            return `/api/v1/holidays/add_holiday_staff_members?${urlQuery}`;
        },
        method: 'GET',
    },
    markRetakeAvatar: {
        getPath(staffMemberId) {
            return `/api/v1/staff_members/${staffMemberId}/mark_retake_avatar`;
        },
        method: 'POST',
    },
    dashboardMessages: {
        getPath: function() {
            return '/api/v1/dashboard_messages';
        },
        method: 'GET'
    },
    disableDashboardMessages: {
        getPath: function(dashboardMessage) {
            return `/api/v1/dashboard_messages/${dashboardMessage}/disable`;
        },
        method: 'PUT'
    },
    restoreDashboardMessages: {
        getPath: function(dashboardMessage) {
            return `/api/v1/dashboard_messages/${dashboardMessage}/restore`;
        },
        method: 'PUT'
    },
    maintenanceTaskImageUpload: {
        getPath: function() {
            return '/api/v1/maintenance_task_image_uploads';
        },
        method: 'POST'
    },
    maintenanceTasks: {
        getPath: function() {
            return '/api/v1/maintenance_tasks';
        },
        method: 'GET'
    },
    maintenanceTaskChangeStatus: {
        getPath: function(maintenanceTaskId) {
            return `/api/v1/maintenance_tasks/${maintenanceTaskId}/change_status`;
        },
        method: 'POST'
    },
    maintenanceTaskNote: {
        getPath: function(maintenanceTaskId) {
            return `/api/v1/maintenance_tasks/${maintenanceTaskId}/add_note`;
        },
        method: 'POST'
    },
    createMaintenanceTask: {
        getPath: function() {
            return '/api/v1/maintenance_tasks';
        },
        method: 'POST'
    },
    deleteMaintenanceTask: {
        getPath: function(maintenanceTaskId) {
            return `/api/v1/maintenance_tasks/${maintenanceTaskId}`;
        },
        method: 'DELETE'
    },
    deleteMaintenanceTaskImage: {
        getPath: function(maintenanceTaskImageId) {
            return `/api/v1/maintenance_task_image_uploads/${maintenanceTaskImageId}`;
        },
        method: 'DELETE'
    },
    updateMaintenanceTask: {
        getPath: function(maintenanceTaskId) {
            return `/api/v1/maintenance_tasks/${maintenanceTaskId}`;
        },
        method: 'PUT'
    },
    marketingTasks: {
        getPath: function() {
            return '/api/v1/marketing_tasks';
        },
        method: 'GET'
    },
    marketingTaskChangeStatus: {
        getPath: function(marketingTaskId) {
            return `/api/v1/marketing_tasks/${marketingTaskId}/change_status`;
        },
        method: 'PUT'
    },
    marketingTaskNote: {
        getPath: function(marketingTaskId) {
            return `/api/v1/marketing_tasks/${marketingTaskId}/notes`;
        },
        method: 'POST'
    },
    createMarketingTask: {
        getPath: function() {
            return '/api/v1/marketing_tasks';
        },
        method: 'POST'
    },
    deleteMarketingTask: {
        getPath: function(marketingTaskId) {
            return `/api/v1/marketing_tasks/${marketingTaskId}`;
        },
        method: 'DELETE'
    },
    restoreMarketingTask: {
        getPath: function(marketingTaskId) {
            return `/api/v1/marketing_tasks/${marketingTaskId}/restore`;
        },
        method: 'PUT'
    },
    deleteMarketingTaskImage: {
        getPath: function(marketingTaskImageId) {
            return `/api/v1/marketing_task_image_uploads/${marketingTaskImageId}`;
        },
        method: 'DELETE'
    },
    updateMarketingTask: {
        getPath: function(marketingTaskId) {
            return `/api/v1/marketing_tasks/${marketingTaskId}`;
        },
        method: 'PUT'
    },
    assignMarketingTaskToSelf: {
        getPath: function(marketingTaskId) {
            return `/api/v1/marketing_tasks/${marketingTaskId}/assign_user`;
        },
        method: 'PUT'
    },
    saveResponse: {
        getPath: function(questionnaireId) {
            return "/questionnaires/" + questionnaireId + "/responses";
        },
        method: 'POST'
    },
    staffMemberPayments: {
      getPath: function(staffMemberId, queryStringParams) {
        if (staffMemberId === undefined) {
          throw new Error("No staff member id supplied to appRoutes.staffMember")
        }
        const baseUrl = `/api/v1/staff_members/${staffMemberId}/payments`;

        if((typeof queryStringParams === 'undefined') || _.isEmpty(queryStringParams)) {
          return baseUrl;
        } else {
          let queryString = '?';
          let paramIndex = 0;
          for( let key in queryStringParams) {
            queryString = `${queryString}${paramIndex > 0 ? '&' : ''}${key}=${queryStringParams[key]}`;
            paramIndex = paramIndex + 1;
          }
          return baseUrl + queryString;
        }
      },
      method: 'GET'
    },
    staffMemberProfileHolidaysIndex: {
      getPath: function(params){
        const staffMemberId = oFetch(params, 'staffMemberId')
        const mStartDate = params.mStartDate;
        const mEndDate = params.mEndDate;
        const mPayslipStartDate = params.mPayslipStartDate;
        const mPayslipEndDate = params.mPayslipEndDate;
        const filteringByDate = mStartDate && mEndDate;
        const filteringByPayslipDate = mPayslipStartDate && mPayslipEndDate;

        let result = "/api/v1/staff_members/" + staffMemberId + "/holidays";
        if(filteringByDate || filteringByPayslipDate){
          result = result + "?"
          if(filteringByDate){
            result = result + "start_date=" + mStartDate.format(utils.apiDateFormat) + "&end_date=" + mEndDate.format(utils.apiDateFormat);
          }
          if(filteringByPayslipDate){
            if(filteringByDate){
              result = result + "&"
            }
            result = result + "payslip_start_date=" + mPayslipStartDate.format(utils.apiDateFormat) + "&payslip_end_date=" + mPayslipEndDate.format(utils.apiDateFormat);
          }
        }
        return result;
      },
      method: 'GET'
    },
    staffMemberProfileUpdatePayslipDate: {
      getPath(options) {
        const accessoryRequestId = oFetch(options, 'accessoryRequestId');

        return `/api/v1/accessory-requests/${accessoryRequestId}/update_payslip_date`;
      },
      method: "POST"
    },
    accessoryRequestUpdatePayslipDate: {
      getPath(options) {
        const accessoryRequestId = oFetch(options, 'accessoryRequestId');

        return `/api/v1/accessory-requests/${accessoryRequestId}/update_payslip_date`;
      },
      method: "POST"
    },
    accessoryRequestRefundUpdatePayslipDate: {
      getPath(options) {
        const accessoryRequestId = oFetch(options, 'accessoryRequestId');

        return `/api/v1/accessory-requests/${accessoryRequestId}/update_refund_payslip_date`;
      },
      method: "POST"
    },
    staffMemberProfileOwedHoursIndex: {
      getPath: function(params){
        const staffMemberId = oFetch(params, 'staffMemberId')
        const mStartDate = params.mStartDate;
        const mEndDate = params.mEndDate;
        const mPayslipStartDate = params.mPayslipStartDate;
        const mPayslipEndDate = params.mPayslipEndDate;
        const filteringByDate = mStartDate && mEndDate;
        const filteringByPayslipDate = mPayslipStartDate && mPayslipEndDate;

        let result = "/api/v1/staff_members/" + staffMemberId + "/owed_hours";
        if(filteringByDate || filteringByPayslipDate){
          result = result + "?"
          if(filteringByDate){
            result = result + "start_date=" + mStartDate.format(utils.apiDateFormat) + "&end_date=" + mEndDate.format(utils.apiDateFormat);
          }
          if(filteringByPayslipDate){
            if(filteringByDate){
              result = result + "&"
            }
            result = result + "payslip_start_date=" + mPayslipStartDate.format(utils.apiDateFormat) + "&payslip_end_date=" + mPayslipEndDate.format(utils.apiDateFormat);
          }
        }
        return result;
      },
      method: 'GET'
    },
    staffMemberProfileAccessoriesIndex: {
      getPath: function(params) {
        const staffMemberId = oFetch(params, 'staffMemberId');
        const { mPayslipStartDate, mPayslipEndDate } = params;
        const filteringByPayslipDate = mPayslipStartDate && mPayslipEndDate;
        let result = `/api/v1/staff_members/${staffMemberId}/accessory-requests`;
        if (filteringByPayslipDate) {
          result = result + "?" + "payslip_start_date=" + mPayslipStartDate.format(utils.apiDateFormat) + "&payslip_end_date=" + mPayslipEndDate.format(utils.apiDateFormat);
        }
        return result;
      },
      method: 'GET'
    },
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
    },
    updateStaffClockingStatus: {
        getPath: function({currentStatus, newStatus}){
            var actionsByCurrentAndNewStatus = {
                "clocked_out": {
                    "clocked_in": "clock_in"
                },
                "clocked_in": {
                    "clocked_out": "clock_out",
                    "on_break": "start_break"
                },
                "on_break": {
                    "clocked_in": "end_break",
                    "clocked_out": "clock_out"
                }
            }
            return "clocking/" + actionsByCurrentAndNewStatus[currentStatus][newStatus];
        },
        method: "POST"
    },
    getSessionToken: {
        getPath(){
            return "sessions"
        },
        method: "POST"
    },
    changeStaffMemberPin: {
        getPath({staffMemberServerId}){
            return "staff_members/" + staffMemberServerId + "/change_pin"
        },
        method: "POST"
    },
    getClockInOutAppData: {
        getPath(){
            return "clock_in_clock_out"
        },
        method: "GET"
    },
    forceClockOut: {
        getPath(){
            return "hours_acceptance_periods/clock_out"
        },
        method: "POST"
    },
    createHoursAccceptancePeriod: {
        getPath(options){
            return "hours_acceptance_periods"
        },
        method: "POST"
    },
    updateHoursAcceptancePeriod: {
        getPath(options){
            return "hours_acceptance_periods/" + oFetch(options, "hoursAcceptancePeriodServerId")
        },
        method: "PUT"
    },
    deleteHoursAcceptancePeriod: {
        getPath(options){
            return "hours_acceptance_periods/" + oFetch(options, "hoursAcceptancePeriodServerId")
        },
        method: "DELETE"
    },
    addClockInNote: {
        getPath(){
            return "clocking/add_note"
        },
        method: "POST"
    },
    getRotaWeeklyDay: {
      getPath(options){
        return  "rota_weekly_day_data?date=" + oFetch(options, "date") + "&venue_id=" + oFetch(options, "serverVenueId")
      },
      method: "GET"
    }
}

export {apiRoutes}
var apiRootPrefix = ""

export function getApiRoot(){
    var apiRootPrefix = "";
    if (window.apiRootPrefix) {
        apiRootPrefix = window.apiRootPrefix
    }
    return apiRootPrefix + "/api/v1/"
}
