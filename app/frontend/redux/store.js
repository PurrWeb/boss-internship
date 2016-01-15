import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk"
import _ from "underscore"
import staffStatusMockData from "~data/staff-status-mock-data"
import * as ACTIONS from "./actions.js"

function staff(state=[], action){
    switch(action.type) {
        case ACTIONS.REPLACE_ALL_STAFF_MEMBERS:
            return action.staffMembers
    }
    return state;
}

function staffStatuses(state=staffStatusMockData, action){
    return Object.assign({}, state, {
        [action.staffId]: action.status
    })
}

function rotaShifts(state=[], action){

    switch (action.type) {
        case ACTIONS.REPLACE_ALL_SHIFTS:
            return action.shifts
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

var rootReducer = combineReducers({
    staff,
    rotaShifts,
    staffStatuses,
    appIsInManagerMode
});
var createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
var store = createStoreWithMiddleware(rootReducer);

export default store;
