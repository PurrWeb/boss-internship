import importedCreateApiRequestAction from "./create-api-request-action"
import _ from "underscore"

export const actionTypes = {};
const createApiRequestAction = function(requestType, makeRequest){
    return importedCreateApiRequestAction(requestType, makeRequest, actionTypes);
}

function makeApiRequest(options){
    return function(requestOptions, success, error) {
        function resolveFunctionParameter(optionsKey){
            if (typeof options[optionsKey] === "function") {
                options[optionsKey] = options[optionsKey](requestOptions);
            }
        };
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
            var actionData = options.getSuccessActionData(responseData, requestOptions);
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
        path: (options) => "venues/" + 1 + "/rota/" + "28-01-2016/rota_shifts",
        data: (options) => options.shift,
        getSuccessActionData: function(responseData) {
            return responseData;
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
        path: "rota_shifts/1",
        method: "PATCH",
        data: function(options){
            alert("using staff_member_id 2 for now")
            options.shift.staff_member_id = 2;
            return options.shift;
        },
        getSuccessActionData(){
            debugger;
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

export function getInitialRotaPageData(){
    let viewData = window.boss.rota;
    viewData.rotas = viewData.rotas;
    viewData.venues = viewData.venues;

    viewData.rotas[0].id = "UNPERSISTED_ROTA";

    var date = viewData.rotas[0].date;
    var [year, month, day] = date.split("-").map(parseFloat);
    viewData.rotas[0].date = new Date(year, month - 1, day, 12, 0);


    let rotaData = viewData.rotas;
    let staffTypeData = viewData.staff_types;
    let rotaShiftData = viewData.rota_shifts;
    let staffMemberData = viewData.staff_members;
    let venueData = viewData.venues;
    let displayedRotaId = _.first(rotaData).id;

    _(rotaShiftData).each((shift) => {
        shift.starts_at = new Date(shift.starts_at);
        shift.ends_at = new Date(shift.ends_at);
    });
    
    return {
        pageOptions: {
            displayedRota: displayedRotaId
        },
        staffTypes: indexById(staffTypeData),
        staffMembers: indexById(staffMemberData),
        rotaShifts: indexById(rotaShiftData),
        rotas: indexById(rotaData),
        venues: indexById(venueData)
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
