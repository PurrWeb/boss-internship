import * as ACTIONS from "./actions.js"
import _ from "underscore"

var initialState = {
    items: [],
    shiftsBeingSaved: []
};
export default function rotaShifts(state=initialState, action){
    console.log("rotaShifts", {
        items: rotaShiftItems(state.items, action),
        shiftsBeingSavedByStaffId: shiftsBeingSavedByStaffId(state.shiftsBeingSavedByStaffId, action)
    })
    return {
        items: rotaShiftItems(state.items, action),
        shiftsBeingSavedByStaffId: shiftsBeingSavedByStaffId(state.shiftsBeingSavedByStaffId, action)
    }
}

function shiftsBeingSavedByStaffId(state={}, action){
    switch(action.type) {
        case ACTIONS.ADD_ROTA_SHIFT_IN_PROGRESS:
            var staffId = action.shift.staff_id;
            if (state[staffId] === undefined) {
                state[staffId] = [];
            } else {
                if (_(state[staffId]).contains(action.shift.id)) {
                    throw new Error("An update for this shift is already in progress.");
                }
            }
            return Object.assign({}, state, {[staffId]: [...state[staffId], action.shift.id]});
        case ACTIONS.ADD_ROTA_SHIFT_SUCCESS:
            var staffId = action.shift.staff_id;
            return Object.assign({}, state, {[staffId]: _(state[staffId]).without(action.shift.id)});
    }
    return state;
}

function rotaShiftItems(state=[], action){
    switch (action.type) {
        case ACTIONS.REPLACE_ALL_SHIFTS:
            return action.shifts
        case ACTIONS.ADD_ROTA_SHIFT_SUCCESS:
            return [...state, action.shift];
        case ACTIONS.UPDATE_ROTA_SHIFT:
            var rotaShiftIndex = _.findIndex(state, {id: action.rota.shift_id});
            var rotaShift = state[rotaShiftIndex];
            rotaShift = Object.assign({}, rotaShift, {
                starts_at: action.rota.starts_at,
                ends_at: action.rota.ends_at
            });
            return [
                ...state.slice(0, rotaShiftIndex),
                rotaShift,
                ...state.slice(rotaShiftIndex + 1)
            ];
        case ACTIONS.DELETE_ROTA_SHIFT:
            var rotaShiftIndex = _.findIndex(state, {id: action.shift_id});
            return [
                ...state.slice(0, rotaShiftIndex),
                ...state.slice(rotaShiftIndex + 1)
            ];
    }
    return state;
}
