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

function createApiRequestAction(requestType, makeRequest){
    const SUCCESS_TYPE = requestType + "_SUCCESS";
    const ERROR_TYPE = requestType + "_ERROR";
    actionTypes[SUCCESS_TYPE] = SUCCESS_TYPE;
    actionTypes[ERROR_TYPE] = ERROR_TYPE;

    return function(options){
        if (options.type || options.requestId || options.requestType) {
            throw "The properties type, requestId and requestType can't be set";
        }

        var requestId = _.uniqueId();

        return function(dispatch) {
            function success(options){
                dispatch({
                    type: SUCCESS_TYPE,
                    ...options
                });
                dispatchRequestEnd();
            }
            function error(options){
                dispatch({
                    type: ERROR_TYPE,
                    ...options
                });
                dispatchRequestEnd();
            }
            function dispatchRequestStart(){
                dispatch({
                    type: actionTypes.API_REQUEST_START,
                    requestId: requestId,
                    requestType: requestType,
                    ...options
                });
            }
            function dispatchRequestEnd(){
                dispatch({
                    requestType: requestType,
                    type: actionTypes.API_REQUEST_END,
                    requestId: requestId,
                    ...options
                });
            }
            
            dispatchRequestStart();
            makeRequest(options, success, error)
        }

    }
}

export const addRotaShift = createApiRequestAction(
    "ADD_SHIFT",
    function(shift, success, error) {
        shift = Object.assign({}, shift, {
            id: Math.floor(Math.random() * 100000000000)
        });
        setTimeout(function(){
            success({shift});
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

export function updateRotaShift (options) {
    var shift = _.clone(options);
    return function(dispatch) {
        dispatch(updateRotaShiftInProgress(shift));
        setTimeout(function(){
            dispatch(updateRotaShiftSuccess(shift))
        }, 3000)
    }
}
export const UPDATE_ROTA_SHIFT_IN_PROGRESS = "UPDATE_ROTA_SHIFT_IN_PROGRESS";
export function updateRotaShiftInProgress (shift) {
    return {
        type: UPDATE_ROTA_SHIFT_IN_PROGRESS,
        shift: shift
    }
}
export const UPDATE_ROTA_SHIFT_SUCCESS = "UPDATE_ROTA_SHIFT_SUCCESS";
export function updateRotaShiftSuccess (shift) {
    return {
        type: UPDATE_ROTA_SHIFT_SUCCESS,
        shift: shift
    }
}

export const DELETE_ROTA_SHIFT = "DELETE_ROTA_SHIFT";
export function deleteRotaShift (shift_id) {
    return {
        type: DELETE_ROTA_SHIFT,
        shift_id: shift_id
    }
}

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


