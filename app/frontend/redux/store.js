import { createStore, combineReducers } from "redux";
import _ from "underscore"
import userData from "~data/users.js"
import staffStatusMockData from "~data/staff-status-mock-data"
import * as ACTIONS from "./actions.js"
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
        case ACTIONS.ADD_ROTA_SHIFT:
            return [...state, action.rota];
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

function appIsInManagerMode(state=false, action){
    switch(action.type) {
        case ACTIONS.ENTER_MANAGER_MODE:
            return true;
        case ACTIONS.LEAVE_MANAGER_MODE:
            return false;
    }
    return state;
}

var store = createStore(combineReducers({
    staff,
    rotaShifts,
    staffStatuses,
    appIsInManagerMode
}));

export default store;
