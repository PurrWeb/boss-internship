import defaultRotaShifts from "../data/default-rota-shifts.js"
import userData from "~data/users.js"

var initialShiftState;
if(window.location.pathname === '/rotas/empty_example') {
    initialShiftState = [];
} else {
    initialShiftState = defaultRotaShifts;
}

export const ADD_ROTA_SHIFT_IN_PROGRESS = "ADD_ROTA_SHIFT_IN_PROGRESS";
export function addRotaShiftInProgress (shift) {
    return {
        type: ADD_ROTA_SHIFT_IN_PROGRESS,
        shift: shift
    }
}

export const ADD_ROTA_SHIFT_SUCCESS = "ADD_ROTA_SHIFT_SUCCESS";
export function addRotaShiftSuccess (shift) {
    return {
        type: ADD_ROTA_SHIFT_SUCCESS,
        shift: shift
    }
}

export function addRotaShift (options) {
    options = Object.assign({}, options, {
        id: Math.floor(Math.random() * 100000000000)
    })
    return function(dispatch) {
        dispatch(addRotaShiftInProgress(options));

        setTimeout(function(){
            dispatch(addRotaShiftSuccess(options))
        }, 2000)
    }
}

export const REPLACE_ALL_SHIFTS = "REPLACE_ALL_SHIFTS";
export function replaceAllShifts (shifts) {
    return {
        type: REPLACE_ALL_SHIFTS,
        shifts: shifts
    }
}

export const UPDATE_ROTA_SHIFT = "UPDATE_ROTA_SHIFT";
export function updateRotaShift (options) {
    return {
        type: UPDATE_ROTA_SHIFT,
        rota: {
            starts_at: options.starts_at,
            ends_at: options.ends_at,
            shift_id: options.shift_id
        }
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

