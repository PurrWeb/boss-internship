import importedCreateApiRequestAction from "./create-api-request-action"
import _ from "underscore"
import moment from "moment"
import utils from "~lib/utils"
import * as backendData from "~lib/backend-data/process-backend-objects"
import makeApiRequest from "./make-api-request"
import {apiRoutes} from "~lib/routes"
import oFetch from "o-fetch"
import RotaDate from "~lib/rota-date"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import { processVenueRotaAppViewData, processClockInOutAppViewData } from "~lib/backend-data/process-app-view-data"

export const actionTypes = {};
const createApiRequestAction = function(options){
    var options = _.clone(options);
    options.actionTypes = actionTypes;
    return importedCreateApiRequestAction(options);
}

function confirmIfRotaIsPublished(options){
    var rota = getRotaFromDateAndVenue({
        rotas: oFetch(options, "rotasByClientId"),
        dateOfRota: oFetch(options, "dateOfRota"),
        venueId: oFetch(options, "venueClientId")
    });
    if (rota.status !== "published") {
        return true;
    }
    return confirm(options.question);
}

function getRotaDateFromShiftStartsAt(startAt){
    var rotaDate = new RotaDate({shiftStartsAt: startAt});
    return rotaDate.getDateOfRota();
}

export const addRotaShift = createApiRequestAction({
    requestType: "ADD_SHIFT",
    makeRequest: makeApiRequest({
        method: apiRoutes.addShift.method,
        path: function({venueServerId, starts_at}, getState) {
            var date = getRotaDateFromShiftStartsAt(starts_at);
            return apiRoutes.addShift.getPath(venueServerId, date);
        },
        data: function(options){
            var [starts_at, ends_at, staff_member_id] = oFetch(options,
                "starts_at", "ends_at", "staffMemberServerId");
            return {
                starts_at,
                ends_at,
                staff_member_id
            }
        },
        getSuccessActionData: function(responseData, requestOptions, getState) {
            responseData = backendData.processShiftObject(responseData);

            // processShiftObject will set rota.clientId based on the rota's server id
            // However, if the rota object was created on the client before it had
            // a server id, we want to use the original clientId
            var rotaDate = new RotaDate({shiftStartsAt: responseData.starts_at});
            var rota = getRotaFromDateAndVenue({
                rotas: getState().rotas,
                dateOfRota: rotaDate.getDateOfRota(),
                venueId: requestOptions.venueClientId
            });
            responseData.rota.clientId = rota.clientId;

            return {shift: responseData};
        }
    }),
    confirm: function(requestOptions, getState){
        var venueClientId = oFetch(requestOptions, "venueClientId");
        var dateOfRota = new RotaDate({shiftStartsAt: oFetch(requestOptions, "starts_at")}).getDateOfRota();
        return confirmIfRotaIsPublished({
            venueClientId,
            dateOfRota,
            rotasByClientId: getState().rotas,
            question: "Adding a shift to a published rota will send out email notifications. Do you want to continue?"
        })
    }
});



actionTypes.REPLACE_ALL_SHIFTS = "REPLACE_ALL_SHIFTS";
export function replaceAllShifts (options) {
    return {
        type: actionTypes.REPLACE_ALL_SHIFTS,
        shifts: options.shifts
    }
}

export const updateRotaShift = createApiRequestAction({
    requestType: "UPDATE_SHIFT",
    makeRequest: makeApiRequest({
        path: (options) => apiRoutes.updateShift.getPath({shiftId: options.shiftServerId}),
        method: apiRoutes.updateShift.method,
        data: function(options, getState){
            var staffMemberId = getState().rotaShifts[options.shiftClientId].staff_member.serverId;
            var shift = {
                shift_id: options.shiftServerId,
                starts_at: options.starts_at,
                ends_at: options.ends_at,
                staff_member_id: staffMemberId
            }
            return shift;
        },
        getSuccessActionData(responseData){
            responseData = backendData.processShiftObject(responseData);
            return {shift: responseData};
        }
    }),
    confirm: function(requestOptions, getState){
        var venueClientId = oFetch(requestOptions, "venueClientId");
        var dateOfRota = new RotaDate({shiftStartsAt: oFetch(requestOptions, "starts_at")}).getDateOfRota();
        return confirmIfRotaIsPublished({
            venueClientId,
            dateOfRota,
            rotasByClientId: getState().rotas,
            question: "Updating a shift on a published rota will send out email notifications. Do you want to continue?"
        })
    }
});



export const deleteRotaShift = createApiRequestAction({
    requestType: "DELETE_SHIFT",
    makeRequest: makeApiRequest({
        method: apiRoutes.deleteShift.method,
        path: (options) => apiRoutes.deleteShift.getPath({shiftId: oFetch(options, "shift.serverId")}),
        getSuccessActionData: function(responseData, requestOptions) {
            return {shiftClientId: requestOptions.shift.clientId}
        }
    }),
    confirm: function(requestOptions, getState){
        var venueClientId = oFetch(requestOptions, "venueClientId");
        var dateOfRota = new RotaDate({shiftStartsAt: oFetch(requestOptions, "shift.starts_at")}).getDateOfRota();
        return confirmIfRotaIsPublished({
            venueClientId,
            dateOfRota,
            rotasByClientId: getState().rotas,
            question: "Deleting a shift on a published rota will send out email notifications. Do you want to continue?"
        })
    }
});

export const updateRotaForecast = createApiRequestAction({
    requestType: "UPDATE_ROTA_FORECAST",
    makeRequest: makeApiRequest({
        method: apiRoutes.updateRotaForecast.method,
        path: (options) => {
            var [dateOfRota, serverVenueId] = oFetch(options, "dateOfRota", "serverVenueId");
            return apiRoutes.updateRotaForecast.getPath({dateOfRota, venueId: serverVenueId})
        },
        data: ({forecastedTake}) => {return {forecasted_take: forecastedTake} },
        getSuccessActionData: function(responseData){
            return {
                rotaForecast: backendData.processRotaForecastObject(responseData)
            }
        }
    })
});

export const fetchWeeklyRotaForecast = createApiRequestAction({
    requestType: "FETCH_WEEKLY_ROTA_FORECAST",
    makeRequest: makeApiRequest({
        method: apiRoutes.weeklyRotaForecast.method,
        path: (options) => {
            var [serverVenueId, startOfWeek] = oFetch(options, "serverVenueId", "startOfWeek")
            return apiRoutes.weeklyRotaForecast.getPath({venueId: serverVenueId, startOfWeek})
        },
        getSuccessActionData: function(responseData){
            return {
              weeklyRotaForecast: responseData
            };
        }
    })
});

export const ENTER_MANAGER_MODE = "ENTER_MANAGER_MODE";
export function enterManagerMode () {
    return {
        type: ENTER_MANAGER_MODE
    }
}

export const LEAVE_MANAGER_MODE = "LEAVE_MANAGER_MODE";
export function leaveManagerMode () {
    return {
        type: LEAVE_MANAGER_MODE
    }
}

export const UPDATE_STAFF_STATUS = "UPDATE_STAFF_STATUS";
export function updateStaffStatus(staffId, status) {
    return {
        type: UPDATE_STAFF_STATUS,
        staffId,
        status
    }
}

actionTypes.REPLACE_ALL_STAFF_MEMBERS = "UPDATE_STAFF_STATUS";
export function replaceAllStaffMembers(options) {
    return {
        type: actionTypes.REPLACE_ALL_STAFF_MEMBERS,
        staffMembers: options.staffMembers
    }
}

actionTypes.REPLACE_ALL_VENUES = "REPLACE_ALL_VENUES";
export function replaceAllVenues(options) {
    return {
        type: actionTypes.REPLACE_ALL_VENUES,
        venues: options.venues
    }
}

actionTypes.REPLACE_ALL_ROTAS = "REPLACE_ALL_ROTAS";
export function replaceAllRotas(options) {
    return {
        type: actionTypes.REPLACE_ALL_ROTAS,
        rotas: options.rotas
    }
}

actionTypes.REPLACE_ALL_ROTA_FORECASTS = "REPLACE_ALL_ROTA_FORECASTS";
export function replaceAllRotaForecasts({rotaForecasts}) {
    return {
        type: actionTypes.REPLACE_ALL_ROTA_FORECASTS,
        rotaForecasts
    }
}

actionTypes.REPLACE_WEEKLY_ROTA_FORECAST = "REPLACE_WEEKLY_ROTA_FORECAST";
export function replaceWeeklyRotaForecast({weeklyRotaForecast}) {
    return {
        type: actionTypes.REPLACE_WEEKLY_ROTA_FORECAST,
        weeklyRotaForecast
    }
}

export const updateRotaStatus = createApiRequestAction({
    requestType: "UPDATE_ROTA_STATUS",
    makeRequest: makeApiRequest({
        method: apiRoutes.updateRotaStatus.method,
        path: function(options){
            if (!options.venueClientId){
                throw new Error("need venueClientId");
            }
            return apiRoutes.updateRotaStatus.getPath(options);
        },
        getSuccessActionData: function(responseData, requestOptions, getState){
            var state = getState();
            var rota = getRotaFromDateAndVenue({
                rotas: state.rotas,
                dateOfRota: requestOptions.date,
                venueId: requestOptions.venueClientId
            });
            
            return {
                rotaClientId: rota.clientId,
                status: responseData.status
            }
        }
    })
});

export const publishRotas = createApiRequestAction({
    requestType: "PUBLISH_ROTAS",
    makeRequest: makeApiRequest({
        method: apiRoutes.publishRotas.method,
        path: function(options){
            return apiRoutes.publishRotas.getPath({
                venueId: options.venueServerId,
                date: options.date
            })
        },
        getSuccessActionData: function(responseData, requestOptions){
            return requestOptions;
        }
    }),
    confirm: function(){
        return confirm("Publishing a rota will send out email confirmations and can't be undone.\nDo you want to continue?")
    }
})


actionTypes.REPLACE_ALL_HOLIDAYS = "REPLACE_ALL_HOLIDAYS";
function replaceAllHolidays(options){
    return {
        type: actionTypes.REPLACE_ALL_HOLIDAYS,
        holidays: options.holidays
    }
}

actionTypes.REPLACE_ALL_STAFF_TYPES = "REPLACE_ALL_STAFF_TYPES";
export function replaceAllStaffTypes(options) {
    return {
        type: actionTypes.REPLACE_ALL_STAFF_TYPES,
        staffTypes: options.staffTypes
    }
}

actionTypes.REPLACE_ALL_STAFF_STATUSES = "REPLACE_ALL_STAFF_STATUSES";
export function replaceAllStaffStatuses(options) {
    return {
        type: actionTypes.REPLACE_ALL_STAFF_STATUSES,
        staffStatuses: options.staffStatuses
    }
}

actionTypes.REPLACE_ALL_STAFF_STATUS_DATA = "REPLACE_ALL_STAFF_STATUS_DATA";
export function replaceAllStaffStatusData(options) {
    return {
        type: actionTypes.REPLACE_ALL_STAFF_STATUS_DATA,
        staffStatusData: options.staffStatusData
    }
}

actionTypes.SET_PAGE_OPTIONS = "SET_PAGE_OPTIONS";
export function setPageOptions(options) {
    return {
        type: actionTypes.SET_PAGE_OPTIONS,
        pageOptions: options.pageOptions
    }
}



export function loadInitialRotaAppState(viewData) {
    var dayRota = getRotaFromDateAndVenue({
        rotas: [],
        dateOfRota: new Date(viewData.rotaDate),
        venueId: viewData.rotaVenueId,
        generateIfNotFound: true
    });
    var hasRotaInBackendData = dayRota.id !== null;
    if (!hasRotaInBackendData) {
        viewData.rota.rotas.push(dayRota);
    }

    var pageOptions = {
        venue: {id: viewData.rotaVenueId },
        dateOfRota: new Date(viewData.rotaDate),
        staffTypeSlug: viewData.staffTypeSlug,
        disableEditingShiftsByStaffTypeName: {
            "Security": true
        }
    };
    return genericLoadInitialRotaAppState(viewData, pageOptions);
}

export function loadInitalStaffTypeRotaAppState(viewData){
    viewData = {...viewData};
    viewData.rota = {...viewData.rota};
    var rotaOverview = viewData.rota;
    rotaOverview.rotas = viewData.rota.rotas.slice();

    // make sure we have a rota for each venue
    _.each(rotaOverview.venues, function(venue){
        var rota = getRotaFromDateAndVenue({
            rotas: viewData.rota.rotas,
            dateOfRota: new Date(rotaOverview.date),
            venueId: venue.id, // this simulates backendData, so use id instead of clientid/serverid
            generateIfNotFound: true
        });

        if (rota.id === null){
            // This rota didn't wasn't found and had to be generated
            rotaOverview.rotas.push(rota);
        }
    });

    var pageOptions = {
        staffTypeSlug: viewData.staffTypeSlug,
        dateOfRota: new Date(viewData.rota.date),
        pdfDownloadUrl: viewData.pdfDownloadUrl
    }
    return genericLoadInitialRotaAppState(viewData, pageOptions);
}

function genericLoadInitialRotaAppState(viewData, pageOptions){
    viewData.pageOptions = pageOptions;
    viewData = processVenueRotaAppViewData(viewData);
    
    let rotaData = viewData.rota.rotas;
    let staffTypeData = viewData.rota.staff_types;
    let rotaShiftData = viewData.rota.rota_shifts;
    let staffMemberData = viewData.rota.staff_members;
    let venueData = viewData.rota.venues;
    let holidays = viewData.rota.holidays;
    pageOptions = viewData.pageOptions;

    return function(dispatch){
        dispatch([
            replaceAllStaffMembers({
                staffMembers: indexByClientId(staffMemberData),
            }),
            replaceAllStaffTypes({
                staffTypes: indexByClientId(staffTypeData),
            }),
            replaceAllShifts({
                shifts: indexByClientId(rotaShiftData)
            }),
            replaceAllVenues({
                venues: indexByClientId(venueData)
            }),
            replaceAllRotas({
                rotas: indexByClientId(rotaData)
            }),
            replaceAllHolidays({
                holidays: indexByClientId(holidays)
            }),
            setPageOptions({pageOptions})
        ]);
    }
}

export function loadInitialClockInOutAppState(viewData) {
    viewData = processClockInOutAppViewData(viewData);
    return function(dispatch){
        dispatch([
            replaceAllStaffMembers({
                staffMembers: indexByClientId(viewData.staff_members)
            }),
            replaceAllStaffTypes({
                staffTypes: indexByClientId(viewData.staff_types)
            }),
            replaceAllStaffStatuses({
                staffStatuses: indexByClientId(viewData.staff_statuses)
            })
        ]);
    }
}

export function loadInitialRotaOverviewAppState(viewData){
    return function(dispatch) {
        var unprocessedRotasArray = _.pluck(viewData.rotas, "rota");
        var rotasArray  = unprocessedRotasArray.map(backendData.processRotaObject);
        var venuesArray = viewData.venues.map(backendData.processVenueObject);
        var rotas = utils.indexByClientId(rotasArray);
        var venues = utils.indexByClientId(venuesArray);

        var forecasts = viewData.rotaForecasts.map(backendData.processRotaForecastObject);
        forecasts = utils.indexByClientId(forecasts);

        var weeklyRotaForecast = backendData.processRotaForecastObject(viewData.weeklyRotaForecast);

        dispatch([
            replaceAllRotas({rotas: rotas}),
            replaceAllRotaForecasts({rotaForecasts: forecasts}),
            replaceWeeklyRotaForecast({weeklyRotaForecast}),
            setPageOptions({pageOptions: {
                startDate: new Date(viewData.startDate),
                endDate: new Date(viewData.endDate)
            }}),
            replaceAllVenues({venues})
        ]);
    }
}


function indexByClientId(data){
    return _.indexBy(data, "clientId")
}
