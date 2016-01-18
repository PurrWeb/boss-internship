import * as ACTIONS from "./actions.js"
import {actionTypes } from "./actions"
import _ from "underscore"

var initialState = {
    items: [],
    shiftsBeingSaved: []
};
export default function rotaShifts(state=initialState, action){
    console.log("rotaShifts", {
        items: rotaShiftItems(state.items, action)
    })
    return {
        items: rotaShiftItems(state.items, action)
    }
}

function rotaShiftItems(state=[], action){
    switch (action.type) {
        case ACTIONS.REPLACE_ALL_SHIFTS:
            return action.shifts;
        case actionTypes.ADD_SHIFT_SUCCESS:
            return [...state, action.shift];
        case ACTIONS.UPDATE_ROTA_SHIFT_SUCCESS:
            var rotaShiftIndex = _.findIndex(state, {id: action.shift.shift_id});
            var rotaShift = state[rotaShiftIndex];
            rotaShift = Object.assign({}, rotaShift, {
                starts_at: action.shift.starts_at,
                ends_at: action.shift.ends_at
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
