import importedCreateApiRequestAction from "./create-api-request-action"
import _ from "underscore"
import moment from "moment"
import * as backendData from "~redux/process-backend-data"
import makeApiRequest from "./make-api-request"
import {apiRoutes} from "~lib/routes"
import oFetch from "o-fetch"
import RotaDate from "~lib/rota-date"

export const actionTypes = {};
const createApiRequestAction = function(options){
    var options = _.clone(options);
    options.actionTypes = actionTypes;
    return importedCreateApiRequestAction(options);
}

function displayedRotaIsPublished(state){
    return state.rotas[state.pageOptions.displayedRota].status === "published";
}
function confirmIfRotaIsPublished(question){
    return function(requestOptions, state){
        if (!displayedRotaIsPublished(state)) {
            return true;
        }
        return confirm(question);
    }
}

export const addRotaShift = createApiRequestAction({
    requestType: "ADD_SHIFT",
    makeRequest: makeApiRequest({
        method: apiRoutes.addShift.method,
        path: function({venueId, shift}, state) {
            var rotaDate = new RotaDate({shiftStartsAt: shift.starts_at});
            var date = rotaDate.getDateOfRota();
            return apiRoutes.addShift.getPath(venueId, date);
        },
        data: (options) => options.shift,
        getSuccessActionData: function(responseData) {
            responseData.starts_at = new Date(responseData.starts_at)
            responseData.ends_at = new Date(responseData.ends_at)
            return {shift: responseData};
        }
    }),
    confirm: confirmIfRotaIsPublished("Adding a shift to a published rota will send out email notifications. Do you want to continue?")
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
        path: (options) => apiRoutes.updateShift.getPath({shiftId: options.shift.shift_id}),
        method: apiRoutes.updateShift.method,
        data: function(options, state){
            options.shift.staff_member_id = state.rotaShifts[options.shift.shift_id].staff_member.id;
            return options.shift;
        },
        getSuccessActionData(responseData){
            responseData = backendData.processShiftObject(responseData);
            return {shift: responseData};
        }
    }),
    confirm: confirmIfRotaIsPublished("Updating a shift on a published rota will send out email notifications. Do you want to continue?")
});



export const deleteRotaShift = createApiRequestAction({
    requestType: "DELETE_SHIFT",
    makeRequest: makeApiRequest({
        method: apiRoutes.deleteShift.method,
        path: (options) => apiRoutes.deleteShift.getPath({shiftId: oFetch(options, "shift_id")}),
        getSuccessActionData: function(responseData, requestOptions) {
            return {shift_id: requestOptions.shift_id}
        }
    }),
    confirm: confirmIfRotaIsPublished("Deleting a shift on a published rota will send out email notifications. Do you want to continue?")
});

export const updateRotaForecast = createApiRequestAction({
    requestType: "UPDATE_ROTA_FORECAST",
    makeRequest: makeApiRequest({
        method: apiRoutes.updateRotaForecast.method,
        path: ({dateOfRota, venueId}) => apiRoutes.updateRotaForecast.getPath({dateOfRota, venueId}),
        data: ({forecastedTake}) => {return {forecasted_take: forecastedTake} },
        getSuccessActionData: function(responseData){
            return {
                rotaForecast: responseData
            }
        }
    })
});

export const fetchWeeklyRotaForecast = createApiRequestAction({
    requestType: "FETCH_WEEKLY_ROTA_FORECAST",
    makeRequest: makeApiRequest({
        method: apiRoutes.weeklyRotaForecast.method,
        path: ({venueId, startOfWeek}) => apiRoutes.weeklyRotaForecast.getPath({venueId, startOfWeek}),
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
            return apiRoutes.updateRotaStatus.getPath(options);
        },
        getSuccessActionData: function(responseData){
            return {
                rotaId: responseData.id,
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
            return apiRoutes.publishRotas.getPath(options)
        },
        getSuccessActionData: function(responseDate, requestOptions){
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

actionTypes.SET_PAGE_OPTIONS = "SET_PAGE_OPTIONS";
export function setPageOptions(options) {
    return {
        type: actionTypes.SET_PAGE_OPTIONS,
        pageOptions: options.pageOptions
    }
}


export function loadInitialRotaAppState(viewData) {
    let rotaData = viewData.rotas;
    let staffTypeData = viewData.staff_types;
    let rotaShiftData = viewData.rota_shifts;
    let staffMemberData = viewData.staff_members;
    let venueData = viewData.venues;
    let holidays = viewData.holidays;

    rotaData = rotaData.map(backendData.processRotaObject);
    rotaShiftData = rotaShiftData.map(backendData.processShiftObject);
    holidays = holidays.map(backendData.processHolidayObject)
    
    return function(dispatch){
        dispatch([
            replaceAllStaffMembers({
                staffMembers: indexById(staffMemberData),
            }),
            replaceAllStaffTypes({
                staffTypes:indexById(staffTypeData),
            }),
            replaceAllShifts({
                shifts: indexById(rotaShiftData)
            }),
            replaceAllVenues({
                venues: indexById(venueData)
            }),
            replaceAllRotas({
                rotas: indexById(rotaData)
            }),
            replaceAllHolidays({
                holidays: indexById(holidays)
            }),
            setPageOptions({pageOptions: {
                displayedRota: _.first(rotaData).id
            }})
        ]);

    }
}

export function loadInitialClockInOutAppState() {
    var userDataById = indexById(userData);
    return function(dispatch){
        setTimeout(function(){
            dispatch(replaceAllStaffMembers({staffMembers: userDataById}));
        }, 3000)
    }
}

export function loadInitialRotaOverviewAppState(viewData){
    return function(dispatch) {
        var unprocessedRotasArray = _.pluck(viewData.rotas, "rota");
        var rotasArray = rotas = unprocessedRotasArray.map(backendData.processRotaObject);
        var rotas = indexById(rotas);


        var forecasts = viewData.rotaForecasts.map(backendData.processRotaForecastObject);
        forecasts = indexById(forecasts);
        
        dispatch([
            replaceAllRotas({rotas: rotas}),
            replaceAllRotaForecasts({rotaForecasts: forecasts}),
            replaceWeeklyRotaForecast({weeklyRotaForecast: viewData.weeklyRotaForecast})
        ]);
    }
}


function indexById(data){
    return _.indexBy(data, "id")
}
