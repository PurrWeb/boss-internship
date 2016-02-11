import importedCreateApiRequestAction from "./create-api-request-action"
import _ from "underscore"
import moment from "moment"
import * as backendData from "~redux/process-backend-data"
import {apiRoutes, API_ROOT} from "~lib/routes"

export const actionTypes = {};
const createApiRequestAction = function(options){
    var options = _.clone(options);
    options.actionTypes = actionTypes;
    return importedCreateApiRequestAction(options);
}

/*
apiOptions:
- method
- path
- data
*/
function makeApiRequest(apiOptions){
    return function(requestOptions, success, error, state) {
        function resolveFunctionParameter(optionsKey){
            if (typeof options[optionsKey] === "function") {
                options[optionsKey] = options[optionsKey](requestOptions, state);
            }
        };
        var options = _.clone(apiOptions);
        requestOptions = _.clone(requestOptions);
        ["method", "path", "data"].map(resolveFunctionParameter);

        if (options.validateOptions) {
            options.validateOptions(requestOptions);
        }

        $.ajax({
           url: API_ROOT + options.path,
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
        path: function(options, state) {
            var rotaId = state.pageOptions.displayedRota;
            var rota = state.rotas[rotaId];
            return apiRoutes.addShift.getPath(rota.venue.id, rota.date);
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
            options.shift.staff_member_id = state.rotaShifts.items[options.shift.shift_id].staff_member.id;
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
        validateOptions: function(options){
            if (options.shift_id === undefined) {
                throw "Need to specify shift_id that should be deleted"
            }
        },
        path: (options) => apiRoutes.deleteShift.getPath({shiftId: options.shift_id}),
        getSuccessActionData: function(responseData, requestOptions) {
            return {shift_id: requestOptions.shift_id}
        }
    }),
    confirm: confirmIfRotaIsPublished("Deleting a shift on a published rota will send out email notifications. Do you want to continue?")
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

    rotaData = rotaData.map(backendData.processRotaObject);
    rotaShiftData = rotaShiftData.map(backendData.processShiftObject);
    
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
        var rotas = _.pluck(viewData, "rota");
        rotas = rotas.map(backendData.processRotaObject);
        rotas = indexById(rotas);
        dispatch(replaceAllRotas({rotas: rotas}));
    }
}


function indexById(data){
    return _.indexBy(data, "id")
}
