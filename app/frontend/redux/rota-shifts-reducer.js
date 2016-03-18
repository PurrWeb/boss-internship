import {actionTypes } from "./actions"
import _ from "underscore"
import utils from "~lib/utils"

export default function rotaShift(state=[], action){
    switch (action.type) {
        case actionTypes.REPLACE_ALL_SHIFTS:
            return action.shifts;
        case actionTypes.ADD_SHIFT_SUCCESS:
            return Object.assign({}, state, {[action.shift.clientId]: action.shift })
        case actionTypes.UPDATE_SHIFT_SUCCESS:
            var shiftClientId = action.shift.clientId;
            if (state[shiftClientId] === undefined) {
                throw "Trying to update a shift that doesn't exist.";
            }
            var rotaShift = state[shiftClientId];
            rotaShift = Object.assign({}, rotaShift, {
                starts_at: action.shift.starts_at,
                ends_at: action.shift.ends_at
            });
            return Object.assign({}, state, {[shiftClientId]: rotaShift});
        case actionTypes.DELETE_SHIFT_SUCCESS:
            if (state[action.shiftClientId] === undefined) {
                throw "Trying to delete a shift that no longer exists.";
            }
            return utils.immutablyDeleteObjectItem(state, action.shiftClientId);
    }
    return state;
}
