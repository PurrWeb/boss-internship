import { createStore, combineReducers } from "redux";
import _ from "underscore"
import userData from "~data/users.js"
import staffStatusMockData from "~data/staff-status-mock-data"
import { DELETE_ROTA_SHIFT,UPDATE_ROTA_SHIFT, ADD_ROTA_SHIFT } from "./actions.js"
import defaultRotaShifts from "../data/default-rota-shifts.js"

var userDataById = _.indexBy(userData, "id");

function staff(state=[], action){
    return userDataById;
}

function staffStatuses(state={}, action){
    return staffStatusMockData;
}

let initialState;
if(window.location.pathname === '/rotas/empty_example') {
  initialState = [];
} else {
  initialState = defaultRotaShifts;
}

function rotaShifts(state=initialState, action){
    switch (action.type) {
        case ADD_ROTA_SHIFT:
            return [...state, action.rota];
        case UPDATE_ROTA_SHIFT:
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
        case DELETE_ROTA_SHIFT:
            var rotaShiftIndex = _.findIndex(state, {id: action.shift_id});
            return [
                ...state.slice(0, rotaShiftIndex),
                ...state.slice(rotaShiftIndex + 1)
            ];
    }
    return state;
}

var store = createStore(combineReducers({
    staff,
    rotaShifts,
    staffStatuses
}));

export default store;
