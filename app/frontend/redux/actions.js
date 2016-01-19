import defaultRotaShifts from "../data/default-rota-shifts.js"
import userData from "~data/users.js"

var initialShiftState;
if(window.location.pathname === '/rotas/empty_example') {
    initialShiftState = [];
} else {
    initialShiftState = defaultRotaShifts;
}

export const actionTypes = {};

window.actionTypes = actionTypes

actionTypes.API_REQUEST_START = "API_REQUEST_START";
actionTypes.API_REQUEST_END = "API_REQUEST_END"
actionTypes.SET_COMPONENT_ERROR = "SET_COMPONENT_ERROR";

function createApiRequestAction(requestType, makeRequest){
    const SUCCESS_TYPE = requestType + "_SUCCESS";
    actionTypes[SUCCESS_TYPE] = SUCCESS_TYPE;

    return function(requestOptions){
        if (requestOptions.type || requestOptions.requestId || requestOptions.requestType) {
            throw "The properties type, requestId and requestType can't be set";
        }

        var requestId = _.uniqueId();

        return function(dispatch) {
            function success(responseOptions){
                dispatch({
                    type: SUCCESS_TYPE,
                    ...responseOptions
                });
                dispatchRequestEnd();
                dispatchSetComponentError(responseOptions);
            }
            function error(responseOptions){
                dispatchRequestEnd();
                dispatchSetComponentError(responseOptions);
            }
            function dispatchSetComponentError(responseOptions){
                dispatch({
                    type: actionTypes.SET_COMPONENT_ERROR,
                    ...responseOptions
                })
            }
            function dispatchRequestStart(){
                dispatch({
                    type: actionTypes.API_REQUEST_START,
                    requestId: requestId,
                    requestType: requestType,
                    ...requestOptions
                });
            }
            function dispatchRequestEnd(){
                dispatch({
                    requestType: requestType,
                    type: actionTypes.API_REQUEST_END,
                    requestId: requestId,
                    ...requestOptions
                });
            }
            
            dispatchRequestStart();
            makeRequest(requestOptions, success, error)
        }

    }
}

export const addRotaShift = createApiRequestAction(
    "ADD_SHIFT",
    function(options, success, error) {
        options = Object.assign({}, options, {
            id: Math.floor(Math.random() * 100000000000)
        });
        setTimeout(function(){
            error({
              ok: false,
              status: 500,
              errors: {
                base: "too boring",
                starts_at: ["must be a date", "can't be between foo and foo"]
              },
              requestComponent: options.requestComponent
            });
            // success({options});
        }, 2000);
    }
);

export const REPLACE_ALL_SHIFTS = "REPLACE_ALL_SHIFTS";
export function replaceAllShifts (shifts) {
    return {
        type: REPLACE_ALL_SHIFTS,
        shifts: shifts
    }
}


export const updateRotaShift = createApiRequestAction(
    "UPDATE_SHIFT",
    function(shift, success, error) {
        setTimeout(function(){
            success({shift});
        }, 2000);
    }
);


export const deleteRotaShift = createApiRequestAction(
    "DELETE_SHIFT",
    function(options, success, error) {
        setTimeout(function(){
            success({...options});
        }, 2000);
    }
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

export const REPLACE_ALL_STAFF_MEMBERS = "UPDATE_STAFF_STATUS";
export function replaceAllStaffMembers(staffMembers) {
    return {
        type: REPLACE_ALL_STAFF_MEMBERS,
        staffMembers
    }
}

export function loadInitialRotaAppState() {
    var userDataById = _.indexBy(userData, "id");
    return function(dispatch){
        setTimeout(function(){
            dispatch(replaceAllStaffMembers(userDataById));
            dispatch(replaceAllShifts(initialShiftState));
        }, 3000)
    }
}

export function loadInitialClockInOutAppState() {
    var userDataById = _.indexBy(userData, "id");
    return function(dispatch){
        setTimeout(function(){
            dispatch(replaceAllStaffMembers(userDataById));
        }, 3000)
    }
}


