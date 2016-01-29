import {actionTypes } from "./actions"
import _ from "underscore"
import utils from "~lib/utils"

var initialState = {
    items: [],
    shiftsBeingSaved: []
};
export default function rotaShifts(state=initialState, action){
    console.log("ACTION", action)
    return {
        items: rotaShiftItems(state.items, action)
    }
}

function rotaShiftItems(state=[], action){
    switch (action.type) {
        case actionTypes.REPLACE_ALL_SHIFTS:
            return action.shifts;
        case actionTypes.ADD_SHIFT_SUCCESS:
            return Object.assign({}, state, {[action.shift.id]: action.shift })
        case actionTypes.UPDATE_SHIFT_SUCCESS:
            var shiftId = action.shift.id;
            if (state[shiftId] === undefined) {
                throw "Trying to update a shift that doesn't exist.";
            }
            var rotaShift = state[shiftId];
            rotaShift = Object.assign({}, rotaShift, {
                starts_at: action.shift.starts_at,
                ends_at: action.shift.ends_at
            });
            return Object.assign({}, state, {[shiftId]: rotaShift});
        case actionTypes.DELETE_SHIFT_SUCCESS:
            if (state[action.shift_id] === undefined) {
                throw "Trying to delete a shift that no longer exists.";
            }
            return utils.immutablyDeleteObjectItem(state, action.shift_id);
    }
    return state;
}
