import importedCreateApiRequestAction from "./create-api-request-action"
import _ from "underscore"
import moment from "moment"
import * as backendData from "~redux/process-backend-data"

export const actionTypes = {};
const createApiRequestAction = function(requestType, makeRequest){
    return importedCreateApiRequestAction(requestType, makeRequest, actionTypes);
}

function makeApiRequest(apiOptions){
    return function(requestOptions, success, error, store) {
        function resolveFunctionParameter(optionsKey){
            if (typeof options[optionsKey] === "function") {
                options[optionsKey] = options[optionsKey](requestOptions, store.getState());
            }
        };
        var options = _.clone(apiOptions);
        requestOptions = _.clone(requestOptions);
        ["method", "path", "data"].map(resolveFunctionParameter);

        if (options.validateOptions) {
            options.validateOptions(requestOptions);
        }

        $.ajax({
           url: "/api/v1/" + options.path,
           method: options.method,
           data: options.data
        }).then(function(responseData){
            var actionData = apiOptions.getSuccessActionData(responseData, requestOptions);
            actionData.requestComponent = requestOptions.requestComponent;
            success(actionData);
        }, function(response){
            var responseData = JSON.parse(response.responseText);
            responseData.requestComponent = requestOptions.requestComponent
            
            error(responseData);
        });
    }
}

export const addRotaShift = createApiRequestAction(
    "ADD_SHIFT",
    makeApiRequest({
        method: "POST",
        path: function(options, state) {
            var rotaId = state.pageOptions.displayedRota;
            var rota = state.rotas[rotaId];
            return "venues/" + rota.venue.id + "/rota/" + moment(rota.date).format("DD-MM-YYYY") + "/rota_shifts"
        },
        data: (options) => options.shift,
        getSuccessActionData: function(responseData) {
            responseData.starts_at = new Date(responseData.starts_at)
            responseData.ends_at = new Date(responseData.ends_at)
            return {shift: responseData};
        }
    })
);



actionTypes.REPLACE_ALL_SHIFTS = "REPLACE_ALL_SHIFTS";
export function replaceAllShifts (options) {
    return {
        type: actionTypes.REPLACE_ALL_SHIFTS,
        shifts: options.shifts
    }
}

export const updateRotaShift = createApiRequestAction(
    "UPDATE_SHIFT",
    makeApiRequest({
        path: (options) => "rota_shifts/" + options.shift.shift_id,
        method: "PATCH",
        data: function(options, state){
            options.shift.staff_member_id = state.rotaShifts.items[options.shift.shift_id].staff_member.id;
            return options.shift;
        },
        getSuccessActionData(responseData){
            responseData = backendData.processShiftObject(responseData);
            return {shift: responseData};
        }
    })
);



export const deleteRotaShift = createApiRequestAction(
    "DELETE_SHIFT",
    makeApiRequest({
        method: "DELETE",
        validateOptions: function(options){
            if (options.shift_id === undefined) {
                throw "Need to specify shift_id that should be deleted"
            }
        },
        path: (options) => "rota_shifts/" + options.shift_id,
        getSuccessActionData: function(responseData, requestOptions) {
            return {shift_id: requestOptions.shift_id}
        }
    })
);

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

export function loadInitialRotaAppState(data) {
    return function(dispatch){
        dispatch([
            replaceAllStaffMembers({staffMembers: data.staffMembers}),
            replaceAllStaffTypes({staffTypes: data.staffTypes}),
            replaceAllShifts({shifts: data.rotaShifts}),
            replaceAllVenues({venues: data.venues}),
            replaceAllRotas({rotas: data.rotas}),
            setPageOptions({pageOptions: data.pageOptions})
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


function indexById(data){
  return _.indexBy(data, "id")
}
