import defaultRotaShifts from "../data/default-rota-shifts.js"
import userData from "~data/users.js"
import createApiRequestActionFactory from "./create-api-request-action"

export const actionTypes = {};
var createApiRequestAction = createApiRequestActionFactory(actionTypes)

export const addRotaShift = createApiRequestAction(
    "ADD_SHIFT",
    function(options, success, error) {
        options.shift = Object.assign({}, options.shift, {
            id: Math.floor(Math.random() * 100000000000)
        });
        setTimeout(function(){
            var shift = options.shift;
            if (shift.starts_at.valueOf() < shift.ends_at.valueOf()) {
                success({shift});
            } else {
                error({
                    ok: false,
                    status: 500,
                    errors: {
                        base: "start time must be before end time"
                    },
                    requestComponent: options.requestComponent
                });
            }
        }, 2000);
    }
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
    function(options, success, error) {
        if (!options.shift === undefined) {
            throw "Need to provide shift with starts_at, ends_at and shift_id properties.";
        }

        setTimeout(function(){
            success(options);
        }, 2000);
    }
);


export const deleteRotaShift = createApiRequestAction(
    "DELETE_SHIFT",
    function(options, success, error) {
        if (options.shift_id === undefined) {
            throw "Need to specify shift_id that should be deleted"
        }
        setTimeout(function(){
            if (Math.random() > .5) {
                error({
                    errors: {
                        "base": "Shift couldn't be deleted. Try again."
                    },
                    requestComponent: options.requestComponent
                })
            } else {
                success(options);
            }
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

actionTypes.REPLACE_ALL_STAFF_MEMBERS = "UPDATE_STAFF_STATUS";
export function replaceAllStaffMembers(options) {
    return {
        type: actionTypes.REPLACE_ALL_STAFF_MEMBERS,
        staffMembers: options.staffMembers
    }
}

var initialShiftState;
if(window.location.pathname === '/rotas/empty_example') {
    initialShiftState = [];
} else {
    initialShiftState = defaultRotaShifts;
}


export function loadInitialRotaAppState() {
    var userDataById = _.indexBy(userData, "id");
    return function(dispatch){
        setTimeout(function(){
            dispatch(replaceAllStaffMembers({staffMembers: userDataById}));
            dispatch(replaceAllShifts({shifts: initialShiftState}));
        }, 3000)
    }
}

export function loadInitialClockInOutAppState() {
    var userDataById = _.indexBy(userData, "id");
    return function(dispatch){
        setTimeout(function(){
            dispatch(replaceAllStaffMembers({staffMembers: userDataById}));
        }, 3000)
    }
}


